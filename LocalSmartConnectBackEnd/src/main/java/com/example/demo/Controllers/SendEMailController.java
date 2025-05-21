package com.example.demo.Controllers;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;


import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Entites.ServiceRequest;
import com.example.demo.Entites.ServiceRequest.Status;
import com.example.demo.Repos.ServiceRequestRepo;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/sendEMail")
public class SendEMailController {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private ServiceRequestRepo requestRepo;

    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

    private final java.util.Map<Long, Integer> currentProviderIndexMap = new java.util.concurrent.ConcurrentHashMap<>();
    private final java.util.Map<Long, LocalDateTime> overallStartTimeMap = new java.util.concurrent.ConcurrentHashMap<>();
    private final java.util.Map<Long, String> currentProviderEmailMap = new java.util.concurrent.ConcurrentHashMap<>();

    @PostMapping("/send/{id}")
    public ResponseEntity<?> sendServiceProviderEmail(@PathVariable Long id) {
        Optional<ServiceRequest> optional = requestRepo.findById(id);
        if (optional.isEmpty()) {
            return ResponseEntity.status(404).body("Service request not found.");
        }

        ServiceRequest request = optional.get();

        // Get list of provider emails
        List<String> providerEmails = request.getServiceProviderEmails();
        if (providerEmails == null || providerEmails.isEmpty()) {
            return ResponseEntity.status(400).body("No service providers available.");
        }

        // Reset request status and start time
        request.setStatus(Status.WAITING);
        request.setCreatedTime(LocalDateTime.now());
        requestRepo.save(request);

        // Initialize tracking data
        currentProviderIndexMap.put(id, 0); // Start with first provider
        overallStartTimeMap.put(id, LocalDateTime.now()); // Track overall process start time

        // Send to first provider
        sendEmailToCurrentProvider(request);

        return ResponseEntity.ok("Email sent to the first provider. Waiting for response...");
    }

    private void sendEmailToCurrentProvider(ServiceRequest request) {
        Long requestId = request.getId();
        List<String> providerEmails = request.getServiceProviderEmails();
        int currentIndex = currentProviderIndexMap.getOrDefault(requestId, 0);
        LocalDateTime overallStartTime = overallStartTimeMap.getOrDefault(requestId, LocalDateTime.now());

        // Check if we have any providers left to try
        if (currentIndex >= providerEmails.size()) {
            request.setStatus(Status.REJECTED); // No provider accepted
            requestRepo.save(request);
            sendNotificationToUser(request);
            cleanupTracking(requestId);
            return;
        }

        // Check if we've exceeded the 10-minute overall timeout
        if (overallStartTime.plusMinutes(10).isBefore(LocalDateTime.now())) {
            request.setStatus(Status.REJECTED); // Timeout
            requestRepo.save(request);
            sendNotificationToUser(request);
            cleanupTracking(requestId);
            return;
        }

        String currentProviderEmail = providerEmails.get(currentIndex);

        // Store current provider email
        currentProviderEmailMap.put(requestId, currentProviderEmail);

        // Update request timing
        request.setCreatedTime(LocalDateTime.now()); // Reset timer for this specific provider
        requestRepo.save(request);

        String link = "http://localhost:5173/respond?id=" + request.getId()+"&providerEmail=" + currentProviderEmail;

        String message = "Dear Service Provider,\n\n" +
                "A customer " + request.getCustomerEmail() + " requested a service. \n" +
                "Category: " + request.getProblemCategory() + "\n" +
                "Description: " + request.getProblemDescription() + "\n\n" +
                "Please respond within 5 minutes.\n\n" +
                "Click here to respond:\n" + link;

        try {
            SimpleMailMessage mail = new SimpleMailMessage();
            mail.setTo(currentProviderEmail);
            mail.setSubject("Service Request Notification");
            mail.setText(message);
            mailSender.send(mail);

            // Schedule check after 5 minutes to see if provider responded
            scheduler.schedule(() -> checkProviderResponse(requestId), 5, TimeUnit.MINUTES);

        } catch (Exception e) {
            // If email fails, try next provider
            currentProviderIndexMap.put(requestId, currentIndex + 1);
            currentProviderEmailMap.remove(requestId);
            sendEmailToCurrentProvider(request);
        }
    }

    private void checkProviderResponse(Long requestId) {
        Optional<ServiceRequest> optional = requestRepo.findById(requestId);
        if (optional.isEmpty()) {
            cleanupTracking(requestId);
            return;
        }

        ServiceRequest request = optional.get();

        // If status is still WAITING, it means no response received (timeout)
        if (request.getStatus() == Status.WAITING) {
            // Try next provider
            int nextIndex = currentProviderIndexMap.getOrDefault(requestId, 0) + 1;
            currentProviderIndexMap.put(requestId, nextIndex);
            currentProviderEmailMap.remove(requestId);
            sendEmailToCurrentProvider(request);
        }
    }

    private void sendNotificationToUser(ServiceRequest request) {
        String userEmail = request.getCustomerEmail();
        String message = "Dear Customer,\n\n" +
                "All service providers are currently busy. Please try again later.\n\n" +
                "Thank you for your understanding.";

        try {
            SimpleMailMessage mail = new SimpleMailMessage();
            mail.setTo(userEmail);
            mail.setSubject("Service Request Status");
            mail.setText(message);
            mailSender.send(mail);
        } catch (Exception e) {
            // Log the error
        }
    }

    private void cleanupTracking(Long requestId) {
        currentProviderIndexMap.remove(requestId);
        overallStartTimeMap.remove(requestId);
        currentProviderEmailMap.remove(requestId);
    }

    @GetMapping("/respond/{id}")
    public ResponseEntity<String> showActionPage(@PathVariable Long id) {
        Optional<ServiceRequest> optional = requestRepo.findById(id);
        if (optional.isEmpty()) {
            return ResponseEntity.status(404).body("Invalid or expired link.");
        }

        ServiceRequest request = optional.get();

        if (request.getCreatedTime().plusMinutes(5).isBefore(LocalDateTime.now())) {
            request.setStatus(Status.TIMEOUT);
            requestRepo.save(request);
            return ResponseEntity.status(410).body("Request has expired.");
        }

        String html = "<html><body>" +
                "<h2>Respond to Service Request</h2>" +
                "<form method='post' action='/api/sendEMail/respond/" + id + "?status=ACCEPTED'>" +
                "<button type='submit'>Accept Task</button></form><br>" +
                "<form method='post' action='/api/sendEMail/respond/" + id + "?status=REJECTED'>" +
                "<button type='submit'>Reject Task</button></form>" +
                "</body></html>";

        return ResponseEntity.ok().header("Content-Type", "text/html").body(html);
    }

    @PostMapping("/respond/{id}")
    public ResponseEntity<?> respondToRequest(
            @PathVariable Long id,
            @RequestParam String status) {

        Optional<ServiceRequest> optional = requestRepo.findById(id);
        if (optional.isEmpty()) {
            return ResponseEntity.status(404).body("Request not found.");
        }

        ServiceRequest request = optional.get();

        if (request.getCreatedTime().plusMinutes(5).isBefore(LocalDateTime.now())) {
            request.setStatus(Status.TIMEOUT);
            requestRepo.save(request);

            // Try next provider
            int nextIndex = currentProviderIndexMap.getOrDefault(id, 0) + 1;
            currentProviderIndexMap.put(id, nextIndex);
            currentProviderEmailMap.remove(id);
            sendEmailToCurrentProvider(request);

            return ResponseEntity.status(410).body("Link expired. You can't respond anymore.");
        }

        try {
            Status newStatus = Status.valueOf(status.toUpperCase());
            request.setStatus(newStatus);
            requestRepo.save(request);

            if (newStatus == Status.REJECTED) {
               
                int nextIndex = currentProviderIndexMap.getOrDefault(id, 0) + 1;
                currentProviderIndexMap.put(id, nextIndex);
                currentProviderEmailMap.remove(id);
                sendEmailToCurrentProvider(request);
                return ResponseEntity.ok("Thank you for your response. Another provider will be contacted.");
            } else if (newStatus == Status.ACCEPTED) {
                
                cleanupTracking(id);
                return ResponseEntity.ok("Thank you for accepting the service request.");
            }

            return ResponseEntity.ok("Thank you for your response.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid status value.");
        }
    }

    @PostMapping("/respondWithCharge/{id}")
    public ResponseEntity<?> respondWithCharge(
            @PathVariable Long id,
            @RequestParam Double serviceCharge,@RequestParam String providerEmail,
            @RequestParam String status) {

        Optional<ServiceRequest> optional = requestRepo.findById(id);
        if (optional.isEmpty()) {
            return ResponseEntity.status(404).body("Request not found.");
        }

        ServiceRequest request = optional.get();

        if (request.getCreatedTime().plusMinutes(5).isBefore(LocalDateTime.now())) {
            request.setStatus(Status.TIMEOUT);
            requestRepo.save(request);

            // Try next provider
            int nextIndex = currentProviderIndexMap.getOrDefault(id, 0) + 1;
            currentProviderIndexMap.put(id, nextIndex);
            currentProviderEmailMap.remove(id);
            sendEmailToCurrentProvider(request);

            return ResponseEntity.status(410).body("Link expired. You can't respond anymore.");
        }

        try {
            Status newStatus = Status.valueOf(status.toUpperCase());
            request.setStatus(newStatus);
            request.setServiceCharge(serviceCharge);
            request.setAccptedEmail(providerEmail);
            requestRepo.save(request);

            if (newStatus == Status.REJECTED) {
                // If rejected, try next provider immediately
                int nextIndex = currentProviderIndexMap.getOrDefault(id, 0) + 1;
                currentProviderIndexMap.put(id, nextIndex);
                currentProviderEmailMap.remove(id);
                sendEmailToCurrentProvider(request);
                return ResponseEntity.ok("Thank you for your response. Another provider will be contacted.");
            } else if (newStatus == Status.ACCEPTED) {
                // If accepted, clean up tracking data
                cleanupTracking(id);
                return ResponseEntity.ok("Service charge and status updated successfully.");
            }

            return ResponseEntity.ok("Service charge and status updated successfully.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid status value.");
        }
    }

    @GetMapping("/status/{id}")
    public ResponseEntity<?> getRequestStatus(@PathVariable Long id) {
        Optional<ServiceRequest> optional = requestRepo.findById(id);
        if (optional.isEmpty()) {
            return ResponseEntity.status(404).body("Request not found.");
        }

        ServiceRequest request = optional.get();

        int currentProviderIndex = currentProviderIndexMap.getOrDefault(id, -1);
        LocalDateTime overallStartTime = overallStartTimeMap.getOrDefault(id, null);
        String currentProviderEmail = currentProviderEmailMap.getOrDefault(id, null);

        String statusInfo = "Status: " + request.getStatus();

        if (currentProviderIndex >= 0 && overallStartTime != null) {
            statusInfo += "\nCurrent provider index: " + currentProviderIndex;
            statusInfo += "\nTime elapsed: " + java.time.Duration.between(overallStartTime, LocalDateTime.now()).toMinutes() + " minutes";
            statusInfo += "\nTime remaining for overall process: " + 
                    Math.max(0, 10 - java.time.Duration.between(overallStartTime, LocalDateTime.now()).toMinutes()) + " minutes";

            if (currentProviderEmail != null) {
                statusInfo += "\nCurrent provider: " + currentProviderEmail;
            } else if (currentProviderIndex < request.getServiceProviderEmails().size()) {
                statusInfo += "\nCurrent provider: " + request.getServiceProviderEmails().get(currentProviderIndex);
            }
        }

        return ResponseEntity.ok(statusInfo);
    }
}

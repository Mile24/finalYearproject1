package com.example.demo.Controllers;


import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.example.demo.Entites.Customer;
import com.example.demo.Entites.ServiceProvider;
import com.example.demo.Entites.ServiceRequest;
import com.example.demo.Repos.CustomerRepository;
import com.example.demo.Repos.ServiceProviderRepositories;
import com.example.demo.Repos.ServiceRequestRepo;



@Controller
@CrossOrigin("*")
@RequestMapping("/api/serviceRequest")
public class ServiceRequestController {
   
    @Autowired
    private ServiceRequestRepo serviceRequestRepo;
    
    @Autowired
    private CustomerRepository customerRepository;
    
    @Autowired
    private ServiceProviderRepositories serviceProviderRepositories;
    
    @PostMapping("/saveRequest")
    @ResponseBody
    public ResponseEntity<?> saveServiceRequest(@RequestBody ServiceRequest serviceRequest) {
        try {
         
            serviceRequest.setCreatedTime(LocalDateTime.now());
            
            // Set initial status to WAITING
            serviceRequest.setStatus(com.example.demo.Entites.ServiceRequest.Status.WAITING);
            
            serviceRequest.setAvailableTime(serviceRequest.getAvailableTime());

            ServiceRequest savedRequest = serviceRequestRepo.save(serviceRequest);
            
            return new ResponseEntity<>(Map.of(
                "message", "Service request created successfully",
                "requestId", savedRequest.getId()
            ), HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(Map.of(
                "error", "Failed to save service request",
                "message", e.getMessage()
            ), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    
    
    @GetMapping("/customer/{email}")
    @ResponseBody
    public ResponseEntity<List<ServiceRequest>> getRequestsByCustomerEmail(@PathVariable String email) {
        List<ServiceRequest> requests = serviceRequestRepo.findByCustomerEmail(email);
        return new ResponseEntity<>(requests, HttpStatus.OK);
    }
    
    @GetMapping("/provider/{email}")
    @ResponseBody
    public ResponseEntity<List<ServiceRequestWithLocationDTO>> getRequestsByProviderEmail(@PathVariable String email) {
        // Fetch all service requests where the provider's email is in the serviceProviderEmails list and the request status is "ACCEPTED"
        List<ServiceRequest> requests = serviceRequestRepo.findByAccptedEmail(email);

        List<ServiceRequestWithLocationDTO> dtoList = new ArrayList<>();

        // Iterate through each service request to build the DTO
        for (ServiceRequest req : requests) {
            Optional<Customer> customer = customerRepository.findByEmail(req.getCustomerEmail());
            Optional<ServiceProvider> provider = serviceProviderRepositories.findByEmail(email);

            // If both customer and provider are found, populate the DTO
            if (customer.isPresent() && provider.isPresent()) {
                ServiceRequestWithLocationDTO dto = new ServiceRequestWithLocationDTO();
                dto.setId(req.getId());
                dto.setCustomerEmail(req.getCustomerEmail());
                dto.setCustomerName(customer.get().getFullName());
                dto.setCustomerLatitude(Double.parseDouble(customer.get().getLatitude()));
                dto.setCustomerLongitude(Double.parseDouble(customer.get().getLongitude()));
                dto.setServiceProviderEmail(email);
                dto.setProviderName(provider.get().getFullName());
                dto.setProviderLatitude(Double.parseDouble(provider.get().getLatitude()));
                dto.setProviderLongitude(Double.parseDouble(provider.get().getLongitude()));
                dto.setProblemCategory(req.getProblemCategory());
                dto.setProblemDescription(req.getProblemDescription());
                dto.setStatus(req.getStatus());
                dto.setCreatedTime(req.getCreatedTime());
                dto.setServiceCharge(req.getServiceCharge());
                dto.setCustomerAcceptanceStatus(req.getCustomerAcceptanceStatus());
                dtoList.add(dto);
            }
        }

        // Return the list of service requests for the provider
        return new ResponseEntity<>(dtoList, HttpStatus.OK);
    }


    @PutMapping("/updateStatus/{id}")
    @ResponseBody
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            ServiceRequest serviceRequest = serviceRequestRepo.findById(id).orElseThrow();
            serviceRequest.setStatus(ServiceRequest.Status.valueOf(request.get("status")));
            serviceRequestRepo.save(serviceRequest);
            return ResponseEntity.ok(Map.of("message", "Status updated"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating status");
        }
    }

    @PutMapping("/updateAcceptance/{id}")
    public ResponseEntity<ServiceRequest> updateAcceptanceStatus(
        @PathVariable Long id, @RequestBody Map<String, String> updates) {
      
      Optional<ServiceRequest> optionalRequest = serviceRequestRepo.findById(id);
      if (!optionalRequest.isPresent()) {
        return ResponseEntity.notFound().build();
      }
      
      ServiceRequest request = optionalRequest.get();
      String newStatus = updates.get("customerAcceptanceStatus");
      request.setCustomerAcceptanceStatus(newStatus);
      
      serviceRequestRepo.save(request);
      return ResponseEntity.ok(request);
    }

    
    
}

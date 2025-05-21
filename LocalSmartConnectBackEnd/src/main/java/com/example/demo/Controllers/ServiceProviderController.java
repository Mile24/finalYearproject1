package com.example.demo.Controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.example.demo.Entites.Customer;
import com.example.demo.Entites.LoginRequest;
import com.example.demo.Entites.ServiceProvider;
import com.example.demo.Repos.CustomerRepository;
import com.example.demo.Repos.ServiceProviderRepositories;
import com.example.demo.Services.ServiceProviderService;

@Controller
@CrossOrigin("*")
@RequestMapping("/api/serviceProvider")

public class ServiceProviderController {

	
	@Autowired
	
	private ServiceProviderService serviceProviderService;
	
	@Autowired
	
	private ServiceProviderRepositories serviceProviderRepositories;
	
	@Autowired
	
	private CustomerRepository customerRepository;
	
	@PostMapping("/register")
    public ResponseEntity<String> registerCustomer(@RequestBody ServiceProvider customer) {
	 
    	 Optional<ServiceProvider> existingCustomer = serviceProviderService.findUsersBasedOnEmailAndFullName(customer.getEmail(), customer.getFullName());
    	
         if (existingCustomer.isPresent()) {
             return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                     .body("ServiceProvider already exists with email or fullname: " + customer.getEmail());
         } else {
        	 serviceProviderService.saveUser(customer);
             return ResponseEntity.status(HttpStatus.CREATED).body("ServiceProvider registered successfully");
         }
    }
    
	 @PostMapping("/login")
	    public ResponseEntity<String> loginCustomer(@RequestBody LoginRequest loginDetails) {
	    	
	        Optional<ServiceProvider> existingCustomer = serviceProviderRepositories.findByEmail(loginDetails.getEmail());

	        if (existingCustomer.isPresent()) {
	        	ServiceProvider customer = existingCustomer.get();
	            // Assuming plain-text password here, but it’s better to hash passwords
	            if (customer.getPassword().equals(loginDetails.getPassword())) {
	                return ResponseEntity.status(HttpStatus.OK).body("Login successful");
	            } else {
	                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
	                        .body("Invalid credentials: Incorrect password");
	            }
	        } else {
	            return ResponseEntity.status(HttpStatus.NOT_FOUND)
	                    .body("User not found with email: " + loginDetails.getEmail());
	        }
	    }
    
	 
	 @GetMapping("/nearby/{customerEmail}")
	 public ResponseEntity<List<ServiceProvider>> getNearbyProviders(
	         @PathVariable String customerEmail) {

	     Optional<Customer> user = customerRepository.findByEmail(customerEmail);

	     if (user.isEmpty()) {
	         return ResponseEntity.notFound().build();
	     }

	     Customer customer = user.get();

	     try {
	         double latitude = Double.parseDouble(customer.getLatitude());
	         double longitude = Double.parseDouble(customer.getLongitude());
	         double radiusInKm = 5.0;

	         List<ServiceProvider> providers = serviceProviderRepositories.findNearby(latitude, longitude, radiusInKm);

	         return ResponseEntity.ok(providers);

	     } catch (NumberFormatException e) {
	         // If parsing fails
	         return ResponseEntity.badRequest().body(null);
	     }
	 }


	 
	 @GetMapping("/getDetails/{email}")
	 public ResponseEntity<ServiceProvider> GetUSers(@PathVariable String email) {
		 
		  Optional<ServiceProvider> existingCustomer = serviceProviderRepositories.findByEmail(email);
		 
	 	return ResponseEntity.ok(existingCustomer.get());
	 }
	 
	 
    @GetMapping("/getallCustomers")
    public ResponseEntity<List<ServiceProvider>> getallCustomers() {
    	return ResponseEntity.ok(serviceProviderService.getallCustomers());
    }
}

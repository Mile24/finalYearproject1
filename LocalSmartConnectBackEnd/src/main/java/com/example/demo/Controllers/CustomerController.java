package com.example.demo.Controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.demo.Entites.Customer;
import com.example.demo.Entites.CustomerDTO;
import com.example.demo.Entites.ServiceRequest;
import com.example.demo.Repos.CustomerRepository;
import com.example.demo.Repos.ServiceRequestRepo;
import com.example.demo.Services.CustomerService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;




@Controller
@CrossOrigin("*")
@RequestMapping("/api/customer")
public class CustomerController {
	
	@Autowired
	
	private CustomerService customerService;
	
	@Autowired
	
	private CustomerRepository customerRepository;
	
	@Autowired
	
	private ServiceRequestRepo serviceRequestRepo;
	
	 @PostMapping("/register")
	    public ResponseEntity<String> registerCustomer(@RequestBody Customer customer) {
		 
	    	 Optional<Customer> existingCustomer = customerService.findUsersBasedOnEmailAndUserName(customer.getEmail(), customer.getFullName());
	    	 
	         if (existingCustomer.isPresent()) {
	             return ResponseEntity.status(HttpStatus.BAD_REQUEST)
	                     .body("User already exists with email or fullname: " + customer.getEmail());
	         } else {
	        	 customerService.saveUser(customer);
	             return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully");
	         }
	    }
	  
	 @PostMapping("/login")
	    public ResponseEntity<String> loginCustomer(@RequestBody Customer loginDetails) {
	    	
	        Optional<Customer> existingCustomer = customerRepository.findByEmail(loginDetails.getEmail());

	        if (existingCustomer.isPresent()) {
	        	Customer customer = existingCustomer.get();
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
	 
	 @GetMapping("/getDetails/{email}")
	 public ResponseEntity<Customer> getCustomers(@PathVariable String email) {
		 
		  Optional<Customer> existingCustomer = customerRepository.findByEmail(email);
		 
	 	return ResponseEntity.ok(existingCustomer.get());
	 }
	 
	    
	    @GetMapping("/getallCustomers")
	    public ResponseEntity<List<Customer>> getallCustomers() {
	    	return ResponseEntity.ok( customerService.getallCustomers());
	    }
	    
	    
	    @GetMapping("/getCustomerDetails/{requestId}")
	    public ResponseEntity<CustomerDTO> getCustomerDetails(@PathVariable Long requestId) {
	        ServiceRequest request = serviceRequestRepo.findById(requestId)
	            .orElseThrow(() -> new RuntimeException("Request not found"));

	       Optional<Customer> optCustomer = customerRepository.findByEmail(request.getCustomerEmail());
	       
	       Customer customer = optCustomer.get();

	        CustomerDTO dto = new CustomerDTO();
	        dto.setName(customer.getFullName());
	        dto.setEmail(customer.getEmail());
	        dto.setAvailableDate(request.getAvailableTime());
	        dto.setPhoneNumber(customer.getPhoneNumber());
	        dto.setAddress(customer.getAddress());

	        return ResponseEntity.ok(dto);
	    }

}

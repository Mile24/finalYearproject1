package com.example.demo.Services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.Entites.Customer;
import com.example.demo.Repos.CustomerRepository;

@Service
public class CustomerService {
	
	@Autowired
	
	private CustomerRepository customerRepository;

	public void saveUser(Customer customer) {
		
		customerRepository.save(customer);
		
	}

	public List<Customer> getallCustomers() {
		
		return customerRepository.findAll();
	}

	public Optional<Customer> findUsersBasedOnEmailAndUserName(String email, String fullName) {
		
		return customerRepository.findByEmailAndFullName(email, fullName);
	}

}

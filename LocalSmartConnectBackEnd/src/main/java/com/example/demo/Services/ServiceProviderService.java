package com.example.demo.Services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.Entites.ServiceProvider;
import com.example.demo.Repos.ServiceProviderRepositories;



@Service
public class ServiceProviderService {

	
	@Autowired
	
	private ServiceProviderRepositories serviceProviderRepositories;

	

	public void saveUser(ServiceProvider customer) {
		
		serviceProviderRepositories.save(customer);
	}

	public List<ServiceProvider> getallCustomers() {
	
		return serviceProviderRepositories.findAll();
	}

	public Optional<ServiceProvider> findUsersBasedOnEmailAndFullName(String email, String fullName) {

		return serviceProviderRepositories.findByEmailAndFullName(email, fullName);
	}
}

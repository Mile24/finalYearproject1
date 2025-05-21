package com.example.demo.Repos;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.demo.Entites.ServiceRequest;

public interface ServiceRequestRepo extends JpaRepository<ServiceRequest, Long> {

	List<ServiceRequest> findByCustomerEmail(String email);

	@Query("SELECT s FROM ServiceRequest s WHERE :email MEMBER OF s.serviceProviderEmails")
    List<ServiceRequest> findByEmailInServiceProviderEmails(@Param("email") String email);


	List<ServiceRequest> findByAccptedEmail(String email);
}

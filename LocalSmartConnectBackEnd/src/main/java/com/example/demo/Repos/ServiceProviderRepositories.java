package com.example.demo.Repos;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.demo.Entites.ServiceProvider;

public interface ServiceProviderRepositories extends JpaRepository<ServiceProvider, Long> {

	Optional<ServiceProvider> findByEmail(String email);



	Optional<ServiceProvider> findByEmailAndFullName(String email, String fullName);



	@Query(value = """
		    SELECT *, 
		        (6371 * acos(
		            cos(radians(:latitude)) * 
		            cos(radians(sp.latitude)) * 
		            cos(radians(sp.longitude) - radians(:longitude)) + 
		            sin(radians(:latitude)) * 
		            sin(radians(sp.latitude))
		        )) AS distance
		    FROM service_providers sp
		    HAVING distance <= :radius
		    ORDER BY distance
		    """, nativeQuery = true)
		List<ServiceProvider> findNearby(
		    @Param("latitude") double latitude,
		    @Param("longitude") double longitude,
		    @Param("radius") double radius);



}

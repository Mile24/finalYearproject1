package com.example.demo.Repos;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.Entites.Review;

public interface ReviewRepository extends JpaRepository<Review, Long> {

	Optional<List<Review>> findByCustomerEmail(String email);

	Optional<List<Review>> findByServiceProviderId(Long id);

}

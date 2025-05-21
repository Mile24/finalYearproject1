package com.example.demo.Controllers;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

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
import org.springframework.web.bind.annotation.ResponseBody;

import com.example.demo.Entites.Review;
import com.example.demo.Entites.ReviewResponseDTO;
import com.example.demo.Entites.ServiceProvider;
import com.example.demo.Repos.CustomerRepository;
import com.example.demo.Repos.ReviewRepository;
import com.example.demo.Repos.ServiceProviderRepositories;



@Controller
@CrossOrigin("*")
@RequestMapping("/api/feedback")
public class ReviewController {
	
	@Autowired
	
	private ReviewRepository reviewRepository;
	
	 @Autowired
	    private CustomerRepository customerRepository;

	    @Autowired
	    private ServiceProviderRepositories serviceProviderRepositories;
	
	@GetMapping("/getAllReviews")
    public ResponseEntity<List<ReviewResponseDTO>> getAllReviewsFromCustomers() {
        List<Review> reviews = reviewRepository.findAll();

        List<ReviewResponseDTO> enrichedReviews = reviews.stream().map(review -> {
            ReviewResponseDTO dto = new ReviewResponseDTO();
            dto.setReviewId(review.getId());
            dto.setReviewText(review.getReviewText());
            dto.setStars(review.getStars());
            dto.setCustomerName(review.getCustomer().getFullName());
            dto.setServiceProviderEmail(review.getServiceProvider().getEmail());
            dto.setServiceProviderName(review.getServiceProvider().getFullName());
            dto.setServiceCategory(review.getServiceProvider().getServiceCategory());
            return dto;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(enrichedReviews);
    }
	
	@PostMapping("/save")
    @ResponseBody
    public ResponseEntity<?> saveReview(@RequestBody Map<String, Object> reviewData) {
        try {
            String customerEmail = (String) reviewData.get("customerEmail");
            String providerEmail = (String) reviewData.get("serviceProviderEmail");
           
            Review review = new Review();
            review.setReviewText((String) reviewData.get("reviewText"));
            review.setStars((Integer) reviewData.get("stars"));
            review.setCustomer(customerRepository.findByEmail(customerEmail).get());
            review.setServiceProvider(serviceProviderRepositories.findByEmail(providerEmail).get());

            reviewRepository.save(review);
            return ResponseEntity.ok("Review saved successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving review");
        }
    }
	@GetMapping("/customer/{email}")
	@ResponseBody
	public ResponseEntity<?> getReviewsByCustomer(@PathVariable String email) {
	    try {
	        Optional<List<Review>> optionalReviews = reviewRepository.findByCustomerEmail(email);

	        if (optionalReviews.isEmpty()) {
	            return ResponseEntity.ok(List.of()); // Return empty list if no reviews found
	        }

	        List<ReviewResponseDTO> responseDTOs = optionalReviews.get().stream().map(review -> {
	            ReviewResponseDTO dto = new ReviewResponseDTO();
	            dto.setReviewId(review.getId());
	            dto.setReviewText(review.getReviewText());
	            dto.setStars(review.getStars());

	            if (review.getCustomer() != null) {
	                dto.setCustomerName(review.getCustomer().getFullName());
	            }

	            if (review.getServiceProvider() != null) {
	                dto.setServiceProviderName(review.getServiceProvider().getFullName());
	                dto.setServiceProviderEmail(review.getServiceProvider().getEmail());
	                dto.setServiceCategory(review.getServiceProvider().getServiceCategory());
	            }

	            return dto;
	        }).toList();

	        return ResponseEntity.ok(responseDTOs);

	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                .body(Map.of("error", "Unable to fetch reviews", "message", e.getMessage()));
	    }
	}
	
	@GetMapping("/serviceProvider/{email}")
	@ResponseBody
	public ResponseEntity<?> getReviewsByServieProvider(@PathVariable String email) {
	    try {
	    	
	    	Optional<ServiceProvider> provider = serviceProviderRepositories.findByEmail(email);
	        Optional<List<Review>> optionalReviews = reviewRepository.findByServiceProviderId(provider.get().getId());

	        if (optionalReviews.isEmpty()) {
	            return ResponseEntity.ok(List.of()); // Return empty list if no reviews found
	        }

	        List<ReviewResponseDTO> responseDTOs = optionalReviews.get().stream().map(review -> {
	            ReviewResponseDTO dto = new ReviewResponseDTO();
	            dto.setReviewId(review.getId());
	            dto.setReviewText(review.getReviewText());
	            dto.setStars(review.getStars());

	            if (review.getCustomer() != null) {
	                dto.setCustomerName(review.getCustomer().getFullName());
	            }

	            if (review.getServiceProvider() != null) {
	                dto.setServiceProviderName(review.getServiceProvider().getFullName());
	                dto.setServiceProviderEmail(review.getServiceProvider().getEmail());
	                dto.setServiceCategory(review.getServiceProvider().getServiceCategory());
	            }

	            return dto;
	        }).toList();

	        return ResponseEntity.ok(responseDTOs);

	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                .body(Map.of("error", "Unable to fetch reviews", "message", e.getMessage()));
	    }
	}


}

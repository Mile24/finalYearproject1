package com.example.demo.Entites;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table(name = "reviews")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String reviewText;
    private int stars;
    
    
    @ManyToOne
    @JoinColumn(name = "service_provider_id")
    @JsonBackReference(value = "serviceProvider-review")
    private ServiceProvider serviceProvider;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    @JsonBackReference(value = "customer-review")
    private Customer customer;

    public Review() {}

    public Review(String reviewText, int stars,  ServiceProvider serviceProvider, Customer customer) {
        this.reviewText = reviewText;
        this.stars = stars;
        this.serviceProvider = serviceProvider;
        this.customer = customer;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getReviewText() {
        return reviewText;
    }

    public void setReviewText(String reviewText) {
        this.reviewText = reviewText;
    }

    public int getStars() {
        return stars;
    }

    public void setStars(int stars) {
        this.stars = stars;
    }

    public ServiceProvider getServiceProvider() {
        return serviceProvider;
    }

    public void setServiceProvider(ServiceProvider serviceProvider) {
        this.serviceProvider = serviceProvider;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }
}

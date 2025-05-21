package com.example.demo.Entites;



public class ReviewResponseDTO {
    private Long reviewId;
    private String reviewText;
    private int stars;
    private String customerName;
    private String serviceProviderName;
    
    private String serviceCategory;
    
    private String serviceProviderEmail;

    // Getters & Setters

    public Long getReviewId() {
        return reviewId;
    }

    public String getServiceProviderEmail() {
		return serviceProviderEmail;
	}

	public void setServiceProviderEmail(String serviceProviderEmail) {
		this.serviceProviderEmail = serviceProviderEmail;
	}

	public String getServiceCategory() {
		return serviceCategory;
	}

	public void setServiceCategory(String serviceCategory) {
		this.serviceCategory = serviceCategory;
	}

	public void setReviewId(Long reviewId) {
        this.reviewId = reviewId;
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

 

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getServiceProviderName() {
        return serviceProviderName;
    }

    public void setServiceProviderName(String serviceProviderName) {
        this.serviceProviderName = serviceProviderName;
    }
}


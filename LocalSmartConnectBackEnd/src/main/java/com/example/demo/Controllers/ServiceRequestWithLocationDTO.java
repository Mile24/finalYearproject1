package com.example.demo.Controllers;

import java.time.LocalDateTime;

import com.example.demo.Entites.ServiceRequest.Status; // ✅ Import the enum from your entity

public class ServiceRequestWithLocationDTO {
    private Long id;
    private String customerEmail;
    private String problemCategory;
    private String problemDescription;
    private String serviceProviderEmail;
    private LocalDateTime createdTime;
    private double serviceCharge;

    private String customerName;
    
    private String customerAcceptanceStatus;
    private double customerLatitude;
    private double customerLongitude;

    private String providerName;
    private double providerLatitude;
    private double providerLongitude;

    private Status status; // ✅ Use the enum type directly

    // === Getters and Setters ===

    public Long getId() { return id; }
    public String getCustomerAcceptanceStatus() {
		return customerAcceptanceStatus;
	}
	public void setCustomerAcceptanceStatus(String customerAcceptanceStatus) {
		this.customerAcceptanceStatus = customerAcceptanceStatus;
	}
	public void setId(Long id) { this.id = id; }

    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }

    public String getProblemCategory() { return problemCategory; }
    public void setProblemCategory(String problemCategory) { this.problemCategory = problemCategory; }

    public String getProblemDescription() { return problemDescription; }
    public void setProblemDescription(String problemDescription) { this.problemDescription = problemDescription; }

    public String getServiceProviderEmail() { return serviceProviderEmail; }
    public void setServiceProviderEmail(String serviceProviderEmail) { this.serviceProviderEmail = serviceProviderEmail; }

    public LocalDateTime getCreatedTime() { return createdTime; }
    public void setCreatedTime(LocalDateTime createdTime) { this.createdTime = createdTime; }

    public double getServiceCharge() { return serviceCharge; }
    public void setServiceCharge(double serviceCharge) { this.serviceCharge = serviceCharge; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public double getCustomerLatitude() { return customerLatitude; }
    public void setCustomerLatitude(double customerLatitude) { this.customerLatitude = customerLatitude; }

    public double getCustomerLongitude() { return customerLongitude; }
    public void setCustomerLongitude(double customerLongitude) { this.customerLongitude = customerLongitude; }

    public String getProviderName() { return providerName; }
    public void setProviderName(String providerName) { this.providerName = providerName; }

    public double getProviderLatitude() { return providerLatitude; }
    public void setProviderLatitude(double providerLatitude) { this.providerLatitude = providerLatitude; }

    public double getProviderLongitude() { return providerLongitude; }
    public void setProviderLongitude(double providerLongitude) { this.providerLongitude = providerLongitude; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
}

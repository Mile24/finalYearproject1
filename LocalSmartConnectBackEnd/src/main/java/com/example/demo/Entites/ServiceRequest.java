package com.example.demo.Entites;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "service_requests")
public class ServiceRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "customer_email", nullable = false)
    private String customerEmail;
    
    @Column(name = "problem_category", nullable = false)
    private String problemCategory;

    @Column(name = "problem_description", nullable = false)
    private String problemDescription;

    @Column(name = "service_provider_emails")
    @ElementCollection
    private List<String> serviceProviderEmails;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private Status status;

    @Column(name = "created_time")
    private LocalDateTime createdTime;
    
    @Column(name = "service_charge")
    private Double serviceCharge;
    
    @Column(name = "available_time")
    private String availableTime;
    
    private String customerAcceptanceStatus;

    private String accptedEmail;
    
    public enum Status {
        ACCEPTED,
        REJECTED,
        WAITING,
        COMPLETED,
        IN_PROGRESS,
        TIMEOUT,
    }

    public ServiceRequest() {}

    
    public ServiceRequest(Long id, String customerEmail, String problemCategory, String problemDescription,
    		List<String> serviceProviderEmails, Status status, LocalDateTime createdTime, Double serviceCharge,
    		String availableTime, String customerAcceptanceStatus, String accptedEmail) {
		super();
		this.id = id;
		this.customerEmail = customerEmail;
		this.problemCategory = problemCategory;
		this.problemDescription = problemDescription;
		this.serviceProviderEmails = serviceProviderEmails;
		this.status = status;
		this.createdTime = createdTime;
		this.serviceCharge = serviceCharge;
		this.availableTime = availableTime;
		this.customerAcceptanceStatus = customerAcceptanceStatus;
		this.accptedEmail = accptedEmail;
	}

	public String getCustomerAcceptanceStatus() {
		return customerAcceptanceStatus;
	}
	public void setCustomerAcceptanceStatus(String customerAcceptanceStatus) {
		this.customerAcceptanceStatus = customerAcceptanceStatus;
	}

	


	public String getAccptedEmail() {
		return accptedEmail;
	}


	public void setAccptedEmail(String accptedEmail) {
		this.accptedEmail = accptedEmail;
	}


	public Double getServiceCharge() {
        return serviceCharge;
    }

    public void setServiceCharge(Double serviceCharge) {
        this.serviceCharge = serviceCharge;
    }
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }

    public String getProblemCategory() { return problemCategory; }
    public void setProblemCategory(String problemCategory) { this.problemCategory = problemCategory; }

    public String getProblemDescription() { return problemDescription; }
    public void setProblemDescription(String problemDescription) { this.problemDescription = problemDescription; }


    public List<String> getServiceProviderEmails() {
		return serviceProviderEmails;
	}


	public void setServiceProviderEmails(List<String> serviceProviderEmails) {
		this.serviceProviderEmails = serviceProviderEmails;
	}


	public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public LocalDateTime getCreatedTime() { return createdTime; }
    public void setCreatedTime(LocalDateTime createdTime) { this.createdTime = createdTime; }


    public String getAvailableTime() {
        return availableTime;
    }

    public void setAvailableTime(String availableTime) {
        this.availableTime = availableTime;
    }




}

package com.example.demo.Entites;


import com.example.demo.Repos.CustomerRepository;
import com.example.demo.Repos.ReviewRepository;
import com.example.demo.Repos.ServiceProviderRepositories;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Component
public class ServiceProviderCommandLineRunner implements CommandLineRunner {

    @Autowired
    private ServiceProviderRepositories serviceProviderRepositories;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    private static final List<String> SERVICE_CATEGORIES = Arrays.asList("Electrician", "Mechanic", "Plumber");

    private static final List<Location> PROVIDER_LOCATIONS = Arrays.asList(
        // Tirupati
        new Location("13.628755", "79.419164"),
        new Location("13.630671", "79.417211"),

        // Renigunta
        new Location("13.635911", "79.520202"),
        new Location("13.634789", "79.518001"),

        // Vellore
        new Location("12.918009", "79.132121"),
        new Location("12.932450", "79.134512")
    );

    private static final List<String> PROVIDER_EMAILS = Arrays.asList(
        "gurijalanag2146@gmail.com",
        "sseswar2218@gmail.com",
        "nageswaraog67@gmail.com",
        "stydotpt@gmail.com",
        "dev@gmail.com",
        "strydotechtptjava@gmail.com"
    );

    private static final List<Customer> CUSTOMERS = Arrays.asList(
        new Customer(null, "Ankit", "ankit@gmail.com", "123", "D.No: 1-23, Near Temple, Tirupati", "9000011111", "13.633051", "79.419901", new ArrayList<>()),
        new Customer(null, "Balaji", "balaji@gmail.com", "123", "D.No: 45-67, Main Bazaar, Renigunta", "9000022222", "13.631289", "79.520923", new ArrayList<>()),
        new Customer(null, "Charan", "charan@gmail.com", "123", "D.No: 78-90, Anna Nagar, Chennai", "9000033333", "13.072134", "80.243754", new ArrayList<>()),
        new Customer(null, "Devi", "devi@gmail.com", "123", "D.No: 12-34, Katpadi, Vellore", "9000044444", "12.934329", "79.134672", new ArrayList<>())
    );

    @Transactional
    @Override
    public void run(String... args) throws Exception {
        if (serviceProviderRepositories.count() == 0) {

            customerRepository.saveAll(CUSTOMERS);

            List<String> providerNames = Arrays.asList(
                "SparkFix Electric Co.",       // Electrician
                "Bright Current Services",     // Electrician
                "GearHead Garage",             // Mechanic
                "AutoFix Mechanics",           // Mechanic
                "PipeMaster Plumbing",         // Plumber
                "AquaFlow Experts"             // Plumber
            );

            List<String> categories = Arrays.asList(
                "Electrician", "Electrician",
                "Mechanic", "Mechanic",
                "Plumber", "Plumber"
            );

            List<ServiceProvider> serviceProviders = new ArrayList<>();

            for (int i = 0; i < 6; i++) {
                ServiceProvider sp = new ServiceProvider();
                sp.setFullName(providerNames.get(i));
                sp.setEmail(PROVIDER_EMAILS.get(i));
                sp.setPassword("123");
                sp.setPhoneNumber("90000" + (1000 + i));
                sp.setLatitude(PROVIDER_LOCATIONS.get(i).latitude);
                sp.setLongitude(PROVIDER_LOCATIONS.get(i).longitude);
                sp.setServiceCategory(categories.get(i));

                ServiceProvider savedProvider = serviceProviderRepositories.save(sp);
                serviceProviders.add(savedProvider);
            }

            Random random = new Random();
            for (Customer customer : CUSTOMERS) {
                for (ServiceProvider provider : serviceProviders) {
                    if (random.nextBoolean()) {
                        int stars = 1 + random.nextInt(5);
                        String text = generateReviewText(stars);

                        Review review = new Review();
                        review.setReviewText(text);
                        review.setStars(stars);
                        review.setCustomer(customer);
                        review.setServiceProvider(provider);

                        reviewRepository.save(review);
                    }
                }
            }
        }
    }

    private String generateReviewText(int stars) {
        return switch (stars) {
            case 5 -> "Excellent service! Highly recommended.";
            case 4 -> "Very good experience. Will use again.";
            case 3 -> "It was okay, nothing special.";
            case 2 -> "Not satisfied. Needs improvement.";
            case 1 -> "Terrible experience. Do not recommend.";
            default -> "No comments.";
        };
    }

    static class Location {
        String latitude;
        String longitude;

        Location(String latitude, String longitude) {
            this.latitude = latitude;
            this.longitude = longitude;
        }
    }
}

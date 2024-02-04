package com.hiringPlatform.authentication.service;

import com.hiringPlatform.authentication.model.Address;
import com.hiringPlatform.authentication.model.Employer;
import com.hiringPlatform.authentication.model.User;
import com.hiringPlatform.authentication.repository.EmployerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EmployerService {

    private final EmployerRepository employerRepository;
    private final AddressService addressService;

    @Autowired
    public EmployerService(EmployerRepository employerRepository, AddressService addressService) {
        this.employerRepository = employerRepository;
        this.addressService = addressService;
    }

    public Employer saveEmployer(User user, String companyName, String street, String zipCode,
                                String city, String region, String country){
        Employer employer = new Employer();
        employer.setUserDetails(user);
        Address address = addressService.saveAddressIfNotExist(zipCode, street, city, region, country);
        employer.setAddress(address);
        employer.setCompanyName(companyName);
        return employerRepository.save(employer);
    }
}

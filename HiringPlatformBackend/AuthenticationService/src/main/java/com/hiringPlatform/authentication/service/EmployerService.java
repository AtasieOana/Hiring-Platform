package com.hiringPlatform.authentication.service;

import com.hiringPlatform.authentication.model.Employer;
import com.hiringPlatform.authentication.model.User;
import com.hiringPlatform.authentication.repository.EmployerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EmployerService {

    private final EmployerRepository employerRepository;

    @Autowired
    public EmployerService(EmployerRepository employerRepository) {
        this.employerRepository = employerRepository;
    }

    public void saveEmployer(User user, String companyName){
        Employer employer = new Employer();
        employer.setUserDetails(user);
        employer.setEmployerId(user.getUserId());
        employer.setCompanyName(companyName);
        employerRepository.save(employer);
    }
}

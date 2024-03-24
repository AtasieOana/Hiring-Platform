package com.hiringPlatform.admin.service;

import com.hiringPlatform.admin.model.Employer;
import com.hiringPlatform.admin.repository.EmployerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class EmployerService {

    private final EmployerRepository employerRepository;

    @Autowired
    public EmployerService(EmployerRepository employerRepository) {
        this.employerRepository = employerRepository;
    }

    public Employer getEmployer(String employerId){
        Optional<Employer> optionalUser = employerRepository.findById(employerId);
        return optionalUser.orElse(null);
    }
}

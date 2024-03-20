package com.hiringPlatform.common.service;

import com.hiringPlatform.common.model.Employer;
import com.hiringPlatform.common.repository.EmployerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class EmployeeService {

    private final EmployerRepository employerRepository;

    @Autowired
    public EmployeeService(EmployerRepository employerRepository) {
        this.employerRepository = employerRepository;
    }

    public Employer getEmployer(String employerId){
        Optional<Employer> optionalUser = employerRepository.findById(employerId);
        return optionalUser.orElse(null);
    }
}

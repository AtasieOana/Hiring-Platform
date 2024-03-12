package com.hiringPlatform.candidate.repository;

import com.hiringPlatform.candidate.model.Employer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployerRepository extends JpaRepository<Employer, String> {

}
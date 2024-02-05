package com.hiringPlatform.employer.repository;

import com.hiringPlatform.employer.model.Employer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmployerRepository extends JpaRepository<Employer, String> {

    @Query("SELECT e FROM Employer e WHERE e.userDetails.email = :email")
    Optional<Employer> findByEmail(String email);
}
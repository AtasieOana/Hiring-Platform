package com.hiringPlatform.candidate.repository;

import com.hiringPlatform.candidate.model.Candidate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CandidateRepository extends JpaRepository<Candidate, String> {

    @Query("SELECT e FROM Candidate e WHERE e.userDetails.email = :email")
    Optional<Candidate> findByEmail(String email);

}
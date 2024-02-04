package com.hiringPlatform.authentication.repository;

import com.hiringPlatform.authentication.model.Candidate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CandidateRepository extends JpaRepository<Candidate, String> {

}
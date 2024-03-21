package com.hiringPlatform.admin.repository;

import com.hiringPlatform.admin.model.Candidate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CandidateRepository extends JpaRepository<Candidate, String> {

}
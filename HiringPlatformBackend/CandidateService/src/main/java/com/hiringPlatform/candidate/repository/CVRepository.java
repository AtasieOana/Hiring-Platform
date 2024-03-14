package com.hiringPlatform.candidate.repository;

import com.hiringPlatform.candidate.model.CV;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CVRepository extends JpaRepository<CV, String> {

    @Query("SELECT e FROM CV e WHERE e.candidate.candidateId = :candidateId ORDER BY e.uploadDate DESC")
    List<CV> findCVsForCandidate(String candidateId);


    @Query("SELECT e FROM CV e WHERE e.candidate.userDetails.email = :email ORDER BY e.uploadDate DESC")
    List<CV> findCVsByEmail(String email);

}
package com.hiringPlatform.candidate.repository;

import com.hiringPlatform.candidate.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, String> {

    @Query("SELECT e FROM Application e WHERE e.applicationId.candidate.candidateId = :candidateId")
    List<Application> findApplicationsForCandidate(String candidateId);

    @Query("SELECT e FROM Application e WHERE e.applicationId.candidate.candidateId = :candidateId AND e.applicationId.job.jobId = :jobId")
    Optional<Application> findByApplicationId(String jobId, String candidateId);
}
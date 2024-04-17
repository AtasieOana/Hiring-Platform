package com.hiringPlatform.employer.repository;

import com.hiringPlatform.employer.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, String> {

    @Query("SELECT e FROM Application e WHERE e.applicationId.job.jobId = :jobId")
    List<Application> findApplicationsForJob(String jobId);

    @Query("SELECT e FROM Application e WHERE e.applicationId.candidate.candidateId = :candidateId AND e.applicationId.job.jobId = :jobId")
    Optional<Application> findByApplicationId(String jobId, String candidateId);

    @Query("SELECT e FROM Application e WHERE e.applicationId.job.employer.employerId = :employerId")
    List<Application> findApplicationsForEmployer(String employerId);
}
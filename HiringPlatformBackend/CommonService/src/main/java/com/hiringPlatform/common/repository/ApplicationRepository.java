package com.hiringPlatform.common.repository;

import com.hiringPlatform.common.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, String> {

    @Query("SELECT e FROM Application e WHERE e.applicationId.candidate.candidateId = :candidateId")
    List<Application> findApplicationsForCandidate(String candidateId);

    @Query("SELECT COUNT(*) FROM Application e WHERE e.applicationId.job.jobId = :jobId")
    Integer findNrOfApplicationForJob(String jobId);
}
package com.hiringPlatform.employer.repository;

import com.hiringPlatform.employer.model.Contains;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContainsRepository extends JpaRepository<Contains, String> {

    @Query("SELECT l FROM Contains l WHERE l.containsId.job.jobId = :jobId")
    List<Contains> findAllByJobId(String jobId);
}
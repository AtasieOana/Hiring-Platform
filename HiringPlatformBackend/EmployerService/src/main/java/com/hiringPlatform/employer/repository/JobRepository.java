package com.hiringPlatform.employer.repository;

import com.hiringPlatform.employer.model.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobRepository extends JpaRepository<Job, String> {

    Optional<Job> findByJobId(String id);

    @Query("SELECT l FROM Job l WHERE l.employer.employerId = :empId ORDER BY l.postingDate DESC ")
    List<Job> findByJobEmployer(String empId);

}
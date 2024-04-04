package com.hiringPlatform.candidate.repository;

import com.hiringPlatform.candidate.model.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, String> {

    @Query("SELECT l FROM Job l WHERE l.employer.employerId = :empId AND l.status = 'deschis' ORDER BY l.postingDate DESC ")
    List<Job> findByJobEmployer(String empId);

    @Query("SELECT l FROM Job l WHERE l.status = 'deschis' ORDER BY l.postingDate DESC ")
    List<Job> findAllJobsOrderByDate();
}
package com.hiringPlatform.admin.repository;

import com.hiringPlatform.admin.model.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JobRepository extends JpaRepository<Job, String> {

}
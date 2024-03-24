package com.hiringPlatform.admin.repository;

import com.hiringPlatform.admin.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, String> {

    @Query("SELECT e.companyName, COUNT(a) AS applicationsCount " +
            "FROM Application a " +
            "JOIN Job j ON a.applicationId.job.jobId = j.jobId " +
            "JOIN Employer e ON j.employer.employerId = e.employerId " +
            "GROUP BY e.companyName " +
            "ORDER BY applicationsCount DESC")
    List<Object[]> findEmployersWithApplicationsCount();
}
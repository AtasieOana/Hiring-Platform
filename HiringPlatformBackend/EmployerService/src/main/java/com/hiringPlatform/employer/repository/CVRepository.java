package com.hiringPlatform.employer.repository;

import com.hiringPlatform.employer.model.CV;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CVRepository extends JpaRepository<CV, String> {


}
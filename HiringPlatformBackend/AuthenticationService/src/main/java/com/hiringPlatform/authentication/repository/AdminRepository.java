package com.hiringPlatform.authentication.repository;

import com.hiringPlatform.authentication.model.Admin;
import com.hiringPlatform.authentication.model.Employer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminRepository extends JpaRepository<Admin, String> {

}
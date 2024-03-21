package com.hiringPlatform.authentication.repository;

import com.hiringPlatform.authentication.model.Admin;
import com.hiringPlatform.authentication.model.Employer;
import com.hiringPlatform.authentication.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Admin, String> {

    @Query("SELECT a from Admin as a where a.userDetails.email = :email")
    Optional<Admin> findByUserDetailsEmail(String email);

}
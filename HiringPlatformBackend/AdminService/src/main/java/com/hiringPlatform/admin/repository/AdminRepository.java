package com.hiringPlatform.admin.repository;

import com.hiringPlatform.admin.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Admin, String> {

    Optional<Admin> getAdminByUserDetailsEmail(String email);
    List<Admin> getAdminsByCreatorUserAdminId(String userId);

    @Query("SELECT a FROM Admin a ORDER BY a.userDetails.email")
    List<Admin> getAllAdminsInOrder();
}

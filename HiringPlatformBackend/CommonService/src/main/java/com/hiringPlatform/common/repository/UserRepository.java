package com.hiringPlatform.common.repository;

import com.hiringPlatform.common.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);

    @Query("SELECT e FROM User e ORDER BY e.email")
    List<User> findAllOrderByEmail();

    List<User> findAllByUserRole_RoleName(String roleName);
}
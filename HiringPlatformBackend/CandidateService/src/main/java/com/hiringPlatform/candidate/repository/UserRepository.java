package com.hiringPlatform.candidate.repository;

import com.hiringPlatform.candidate.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    Optional<User> findByEmail(String email);

    List<User> findAllByUserRole_RoleName(String roleName);
}
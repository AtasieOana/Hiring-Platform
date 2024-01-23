package com.hiringPlatform.authentication.repository;

import com.hiringPlatform.authentication.model.AuthenticationToken;
import com.hiringPlatform.authentication.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AuthenticationTokenRepository extends JpaRepository<AuthenticationToken, String> {

    @Query("SELECT token from AuthenticationToken as token where token.user.email = :email")
    Optional<AuthenticationToken> findByUserEmail(String email);
}
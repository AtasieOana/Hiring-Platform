package com.hiringPlatform.employer.repository;

import com.hiringPlatform.employer.model.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, String> {

    @Query("SELECT e FROM Profile e WHERE e.employer.userDetails.email = :email")
    Optional<Profile> findByEmployerEmail(String email);

}
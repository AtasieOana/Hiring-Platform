package com.hiringPlatform.employer.repository;

import com.hiringPlatform.employer.model.Stage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StageRepository extends JpaRepository<Stage, String> {

    Optional<Stage> findByStageName(String name);

}
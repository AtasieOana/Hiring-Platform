package com.hiringPlatform.candidate.repository;

import com.hiringPlatform.candidate.model.Stage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StageRepository extends JpaRepository<Stage, String> {

    Optional<Stage> findByStageName(String name);

}
package com.hiringPlatform.candidate.repository;

import com.hiringPlatform.candidate.model.Contains;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ContainsRepository extends JpaRepository<Contains, String> {

    @Query("SELECT l FROM Contains l WHERE l.containsId.job.jobId = :jobId ORDER BY l.stageNr")
    List<Contains> findAllByJobId(String jobId);

    @Query("SELECT l FROM Contains l WHERE l.containsId.job.jobId = :jobId and l.stageNr =:stageNr")
    Optional<Contains> findByJobIdAndStageNumber(String jobId, Number stageNr);

    @Query("SELECT l FROM Contains l WHERE l.containsId.job.jobId = :jobId and l.containsId.stage.stageId =:stageId")
    Optional<Contains> findByJobIdAndStageId(String jobId, String stageId);
}
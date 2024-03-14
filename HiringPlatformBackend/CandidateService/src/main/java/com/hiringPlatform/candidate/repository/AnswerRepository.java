package com.hiringPlatform.candidate.repository;

import com.hiringPlatform.candidate.model.Answer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnswerRepository extends JpaRepository<Answer, String> {

    @Query("SELECT e FROM Answer e WHERE e.question.job.jobId = :jobId")
    List<Answer> findAnswersByJob(String jobId);

}
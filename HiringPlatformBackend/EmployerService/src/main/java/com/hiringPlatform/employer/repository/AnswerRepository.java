package com.hiringPlatform.employer.repository;

import com.hiringPlatform.employer.model.Answer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnswerRepository extends JpaRepository<Answer, String> {

    @Query("SELECT e FROM Answer e WHERE e.question.job.jobId = :jobId AND e.candidate.candidateId = :candidateId")
    List<Answer> findAnswersByJobAndCandidateId(String jobId, String candidateId);

}
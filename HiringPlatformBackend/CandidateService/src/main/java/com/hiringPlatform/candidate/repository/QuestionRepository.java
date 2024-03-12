package com.hiringPlatform.candidate.repository;

import com.hiringPlatform.candidate.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, String> {

    @Query("SELECT l FROM Question l WHERE l.job.jobId = :jobId ORDER BY l.questionNumber")
    List<Question> findAllByJobId(String jobId);

}
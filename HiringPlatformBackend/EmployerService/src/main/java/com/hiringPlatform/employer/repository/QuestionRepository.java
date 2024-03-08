package com.hiringPlatform.employer.repository;

import com.hiringPlatform.employer.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, String> {

    @Query("SELECT l FROM Question l WHERE l.job.jobId = :jobId ORDER BY l.questionNumber")
    List<Question> findAllByJobId(String jobId);

}
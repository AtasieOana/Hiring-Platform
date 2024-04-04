package com.hiringPlatform.candidate.repository;

import com.hiringPlatform.candidate.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, String> {

    @Query("SELECT r FROM Review r WHERE r.employer.employerId = :employerId ORDER BY r.commentDate DESC")
    List<Review> findReviewsByEmployerEmployerId(String employerId);

    @Query("SELECT COALESCE(AVG(r.grade), 0) FROM Review r WHERE r.employer.employerId = :employerId")
    Double getAvgGradeForEmployer(String employerId);
}
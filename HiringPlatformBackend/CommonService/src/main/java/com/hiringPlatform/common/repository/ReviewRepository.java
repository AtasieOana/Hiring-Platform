package com.hiringPlatform.common.repository;

import com.hiringPlatform.common.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, String> {

    @Query("SELECT r FROM Review r WHERE r.employer.employerId = :employerId ORDER BY r.commentDate DESC")
    List<Review> findReviewsByEmployerEmployerId(String employerId);
}
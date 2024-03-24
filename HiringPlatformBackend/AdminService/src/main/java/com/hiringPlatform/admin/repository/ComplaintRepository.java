package com.hiringPlatform.admin.repository;

import com.hiringPlatform.admin.model.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, String> {

    @Query("SELECT c FROM Complaint c ORDER BY c.complaintDate DESC")
    List<Complaint> findAllOrderDescByDate();
}

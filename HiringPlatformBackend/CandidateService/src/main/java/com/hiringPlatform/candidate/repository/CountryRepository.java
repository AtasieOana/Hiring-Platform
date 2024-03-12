package com.hiringPlatform.candidate.repository;

import com.hiringPlatform.candidate.model.Country;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CountryRepository extends JpaRepository<Country, String> {

    Optional<Country> getCountryByCountryName(String name);
}
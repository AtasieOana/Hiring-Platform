package com.hiringPlatform.authentication.repository;

import com.hiringPlatform.authentication.model.Country;
import com.hiringPlatform.authentication.model.Region;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RegionRepository extends JpaRepository<Region, String> {

    Optional<Region> getRegionByCountryAndRegionName(Country country, String regionName);

}
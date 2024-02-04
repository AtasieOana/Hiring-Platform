package com.hiringPlatform.authentication.repository;

import com.hiringPlatform.authentication.model.City;
import com.hiringPlatform.authentication.model.Region;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CityRepository extends JpaRepository<City, String> {

    Optional<City> getCityByRegionAndCityName(Region region, String name);

}
package com.hiringPlatform.common.repository;

import com.hiringPlatform.common.model.City;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface CityRepository extends JpaRepository<City, String> {

    @Query("SELECT r.regionName, o.cityName " +
            "FROM City o JOIN o.region r " +
            "GROUP BY r.regionName, o.cityName " +
            "ORDER BY r.regionName, o.cityName")
    List<Object[]> findAllCitiesByRegions();

}
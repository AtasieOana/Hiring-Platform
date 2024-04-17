package com.hiringPlatform.common.service;

import com.hiringPlatform.common.repository.CityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AddressService {

    private final CityRepository cityRepository;

    @Autowired
    public AddressService(CityRepository cityRepository) {
        this.cityRepository = cityRepository;
    }

    public Map<String, List<String>> getAllCitiesByRegions() {
        List<Object[]> queryResult = cityRepository.findAllCitiesByRegions();

        Map<String, List<String>> finalResult = new HashMap<>();

        // We go through the query results and process them
        for (Object[] object : queryResult) {
            String region = (String) object[0];
            String city = (String) object[1];

            // We check if the region already exists in the map
            if (!finalResult.containsKey(region)) {
                // If it doesn't exist, we add a new list of cities for that region
                finalResult.put(region, new ArrayList<>());
            }

            // We add the city to the list of cities associated with the region
            finalResult.get(region).add(city);
        }

        return finalResult;
    }
}

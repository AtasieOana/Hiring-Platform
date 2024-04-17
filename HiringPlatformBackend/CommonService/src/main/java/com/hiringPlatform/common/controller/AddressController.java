package com.hiringPlatform.common.controller;

import com.hiringPlatform.common.service.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.Map;

@RestController
public class AddressController {

    @Autowired
    private AddressService addressService;

    @GetMapping("/getAllCitiesByRegions")
    public ResponseEntity<Map<String, List<String>>> getAllCitiesByRegions() {
        Map<String, List<String>> citiesAndRegions = addressService.getAllCitiesByRegions();
        return ResponseEntity.ok(citiesAndRegions);
    }


}

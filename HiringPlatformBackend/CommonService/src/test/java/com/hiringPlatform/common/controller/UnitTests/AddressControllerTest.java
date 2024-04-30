package com.hiringPlatform.common.controller.UnitTests;

import com.hiringPlatform.common.controller.AddressController;
import com.hiringPlatform.common.service.AddressService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.*;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class AddressControllerTest {

    @InjectMocks
    AddressController addressController;

    @Mock
    AddressService addressService;

    @Test
    public void testGetAllCitiesByRegions() {
        // Given
        Map<String, List<String>> response = new HashMap<>();
        response.put("Region1", Arrays.asList("City1", "City2"));

        // When
        when(addressService.getAllCitiesByRegions()).thenReturn(response);

        // Then
        ResponseEntity<Map<String, List<String>>> result = addressController.getAllCitiesByRegions();
        assertEquals(result.getBody(), response);
        assertEquals(result.getStatusCode(), HttpStatus.OK);
    }

}

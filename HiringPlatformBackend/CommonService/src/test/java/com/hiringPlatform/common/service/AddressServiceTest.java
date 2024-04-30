package com.hiringPlatform.common.service;

import com.hiringPlatform.common.repository.CityRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class AddressServiceTest {

    @InjectMocks
    AddressService addressService;

    @Mock
    CityRepository cityRepository;

    @Test
    public void testGetAllCitiesByRegions() {
        // Given
        Object[] row1 = {"Region1", "City1"};
        Object[] row2 = {"Region1", "City2"};
        Object[] row3 = {"Region2", "City3"};
        List<Object[]> queryResult = new ArrayList<>();
        queryResult.add(row1);
        queryResult.add(row2);
        queryResult.add(row3);

        // When
        when(cityRepository.findAllCitiesByRegions()).thenReturn(queryResult);

        // Then
        Map<String, List<String>> result = addressService.getAllCitiesByRegions();

        assertEquals(2, result.size());
        assertTrue(result.containsKey("Region1"));
        assertTrue(result.containsKey("Region2"));

        assertEquals(Arrays.asList("City1", "City2"), result.get("Region1"));
        assertEquals(Collections.singletonList("City3"), result.get("Region2"));

    }

}

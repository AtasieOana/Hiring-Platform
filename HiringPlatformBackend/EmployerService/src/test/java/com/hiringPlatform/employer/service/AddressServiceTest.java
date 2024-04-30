package com.hiringPlatform.employer.service;

import com.hiringPlatform.employer.model.Address;
import com.hiringPlatform.employer.model.City;
import com.hiringPlatform.employer.model.Region;
import com.hiringPlatform.employer.repository.AddressRepository;
import com.hiringPlatform.employer.repository.CityRepository;
import com.hiringPlatform.employer.repository.RegionRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class AddressServiceTest {

    @InjectMocks
    AddressService addressService;

    @Mock
    AddressRepository addressRepository;

    @Mock
    CityRepository cityRepository;

    @Mock
    RegionRepository regionRepository;

    @Test
    public void testGetRegionPresent() {
        // Given
        Region region = buildRegion();

        // When
        when(regionRepository.findByRegionName(region.getRegionName())).thenReturn(Optional.of(region));

        // Then
        Region result = addressService.getRegion(region.getRegionName());
        assertEquals(result, region);
    }

    @Test
    public void testGetRegionNotPresent() {
        // Given
        Region region = buildRegion();

        // When
        when(regionRepository.findByRegionName(region.getRegionName())).thenReturn(Optional.empty());

        // Then
        Region result = addressService.getRegion(region.getRegionName());
        assertNull(result);
    }

    @Test
    public void testGetCityPresent() {
        // Given
        City city = buildCity();

        // When
        when(regionRepository.findByRegionName(city.getRegion().getRegionName())).thenReturn(Optional.of(city.getRegion()));
        when(cityRepository.getCityByRegionAndCityName(city.getRegion(), city.getCityName())).thenReturn(Optional.of(city));

        // Then
        City result = addressService.getCity(city.getCityName(), city.getRegion().getRegionName());
        assertEquals(result, city);
    }

    @Test
    public void testGetCityNotPresent() {
        // Given
        City city = buildCity();

        // When
        when(regionRepository.findByRegionName(city.getRegion().getRegionName())).thenReturn(Optional.of(city.getRegion()));
        when(cityRepository.getCityByRegionAndCityName(city.getRegion(), city.getCityName())).thenReturn(Optional.empty());

        // Then
        City result = addressService.getCity(city.getCityName(), city.getRegion().getRegionName());
        assertNull(result);
    }

    @Test
    public void testSaveAddressIfExists() {
        // Given
        City city = buildCity();
        Address address = buildAddress();

        // When
        when(regionRepository.findByRegionName(city.getRegion().getRegionName())).thenReturn(Optional.of(city.getRegion()));
        when(cityRepository.getCityByRegionAndCityName(city.getRegion(), city.getCityName())).thenReturn(Optional.of(city));
        when(addressRepository.getAddressByCityAndStreet(city, address.getStreet())).thenReturn(Optional.of(address));

        // Then
        Address result = addressService.saveAddressIfNotExist(address.getZipCode(), address.getStreet(), address.getCity().getCityName(), city.getRegion().getRegionName());
        assertEquals(result, address);
    }

    @Test
    public void testSaveAddressIfNotExists() {
        // Given
        City city = buildCity();
        Address address = buildAddress();

        // When
        when(regionRepository.findByRegionName(city.getRegion().getRegionName())).thenReturn(Optional.of(city.getRegion()));
        when(cityRepository.getCityByRegionAndCityName(city.getRegion(), city.getCityName())).thenReturn(Optional.of(city));
        when(addressRepository.getAddressByCityAndStreet(city, address.getStreet())).thenReturn(Optional.empty());
        when(addressRepository.save(any(Address.class))).thenReturn(address);

        // Then
        Address result = addressService.saveAddressIfNotExist(address.getZipCode(), address.getStreet(), address.getCity().getCityName(), city.getRegion().getRegionName());
        assertEquals(result, address);
    }

    private Region buildRegion(){
        Region region = new Region();
        region.setRegionId("1");
        region.setRegionName("regionName");
        return region;
    }

    private City buildCity(){
        City city = new City();
        city.setCityName("1");
        city.setCityName("cityName");
        city.setRegion(buildRegion());
        return city;
    }

    private Address buildAddress(){
        Address address = new Address();
        address.setAddressId("1");
        address.setCity(buildCity());
        address.setStreet("streetTest");
        address.setZipCode("012345");
        return address;
    }
}

package com.hiringPlatform.employer.service;

import com.hiringPlatform.employer.model.Address;
import com.hiringPlatform.employer.model.City;
import com.hiringPlatform.employer.model.Region;
import com.hiringPlatform.employer.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AddressService {

    private final AddressRepository addressRepository;
    private final CityRepository cityRepository;
    private final RegionRepository regionRepository;

    @Autowired
    public AddressService(AddressRepository addressRepository, CityRepository cityRepository,
                          RegionRepository regionRepository) {
        this.addressRepository = addressRepository;
        this.cityRepository = cityRepository;
        this.regionRepository = regionRepository;
    }

    public Region getRegion(String name){
        Optional<Region> region = regionRepository.findByRegionName(name);
        return region.orElse(null);
    }

    public City getCity(String name, String regionName){
        Region region = getRegion(regionName);
        Optional<City> city = cityRepository.getCityByRegionAndCityName(region, name);
        return city.orElse(null);
    }

    public Address saveAddressIfNotExist(String zipCode, String street, String cityName, String regionName){
        City city = getCity(cityName, regionName);
        Optional<Address> address = addressRepository.getAddressByCityAndStreet(city, street);
        if(address.isPresent()){
            return address.get();
        }
        else{
            Address newAddress = new Address();
            newAddress.setCity(city);
            newAddress.setStreet(street);
            newAddress.setZipCode(zipCode);
            return addressRepository.save(newAddress);
        }
    }
}

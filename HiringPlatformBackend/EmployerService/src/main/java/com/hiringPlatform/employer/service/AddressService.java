package com.hiringPlatform.employer.service;

import com.hiringPlatform.employer.model.Address;
import com.hiringPlatform.employer.model.City;
import com.hiringPlatform.employer.model.Country;
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
    private final CountryRepository countryRepository;

    @Autowired
    public AddressService(AddressRepository addressRepository, CityRepository cityRepository, RegionRepository regionRepository, CountryRepository countryRepository) {
        this.addressRepository = addressRepository;
        this.cityRepository = cityRepository;
        this.countryRepository = countryRepository;
        this.regionRepository = regionRepository;
    }

    public Country saveCountryIfNotExist(String name){
        Optional<Country> country = countryRepository.getCountryByCountryName(name);
        if(country.isPresent()){
            return country.get();
        }
        else{
            Country newCountry = new Country();
            newCountry.setCountryName(name);
            return countryRepository.save(newCountry);
        }
    }

    public Region saveRegionIfNotExist(String name, String countryName){
        Country country = saveCountryIfNotExist(countryName);
        Optional<Region> region = regionRepository.getRegionByCountryAndRegionName(country, name);
        if(region.isPresent()){
            return region.get();
        }
        else{
            Region newRegion = new Region();
            newRegion.setRegionName(name);
            newRegion.setCountry(country);
            return regionRepository.save(newRegion);
        }
    }

    public City saveCityIfNotExist(String name, String regionName, String countryName){
        Region region = saveRegionIfNotExist(regionName, countryName);
        Optional<City> city = cityRepository.getCityByRegionAndCityName(region, name);
        if(city.isPresent()){
            return city.get();
        }
        else{
           City newCity = new City();
           newCity.setCityName(name);
           newCity.setRegion(region);
           return cityRepository.save(newCity);
        }
    }

    public Address saveAddressIfNotExist(String zipCode, String street, String cityName, String regionName, String countryName){
        City city = saveCityIfNotExist(cityName, regionName, countryName);
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

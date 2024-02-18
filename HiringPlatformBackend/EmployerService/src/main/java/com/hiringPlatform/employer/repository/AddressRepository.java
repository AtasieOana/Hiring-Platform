package com.hiringPlatform.employer.repository;

import com.hiringPlatform.employer.model.Address;
import com.hiringPlatform.employer.model.City;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AddressRepository extends JpaRepository<Address, String> {

    Optional<Address> getAddressByCityAndStreet(City city, String street);

}
package com.air.service.impl;

import com.air.entity.City;
import com.air.repository.CityRepository;
import com.air.service.CityService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CityServiceImpl implements CityService {

    private final CityRepository cityRepository;

    public CityServiceImpl(CityRepository cityRepository) {
        this.cityRepository = cityRepository;
    }

    @Override
    public List<City> getAllCities() {
        return cityRepository.findAll();
    }

    @Override
    public City getCityById(Long id) {
        return cityRepository.findById(id).orElse(null);
    }

    @Override
    public City createCity(City city) {
        return cityRepository.save(city);
    }

    @Override
    public City updateCity(Long id, City city) {
        City existingCity = getCityById(id);
        if (existingCity != null) {
            existingCity.setCityName(city.getCityName());
            existingCity.setCountry(city.getCountry());
            return cityRepository.save(existingCity);
        }
        return null;
    }

    @Override
    public void deleteCity(Long id) {
        cityRepository.deleteById(id);
    }
}

package com.air.controller;

import com.air.entity.City;
import com.air.service.CityService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/city")
public class CityController {

    private final CityService cityService;

    public CityController(CityService cityService) {
        this.cityService = cityService;
    }

    @GetMapping("/")
    public List<City> getAllCities() {
        return cityService.getAllCities();
    }

    @GetMapping("/{id}")
    public City getCityById(@PathVariable("id") Long id) {
        return cityService.getCityById(id);
    }

    @PostMapping("/")
    public City createCity(@RequestBody City city) {
        return cityService.createCity(city);
    }

    @PutMapping("/{id}")
    public City updateCity(@PathVariable("id") Long id, @RequestBody City city) {
        return cityService.updateCity(id, city);
    }

    @DeleteMapping("/{id}")
    public void deleteCity(@PathVariable("id") Long id) {
        cityService.deleteCity(id);
    }
}

package com.air.config;

import com.air.entity.*;
import com.air.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

@Configuration
public class DataSeeder implements CommandLineRunner {

    private final AirlineRepository airlineRepository;
    private final CityRepository cityRepository;
    private final AirportRepository airportRepository;
    private final FlightRepository flightRepository;
    private final AdminRepository adminRepository;

    public DataSeeder(AirlineRepository airlineRepository,
            CityRepository cityRepository,
            AirportRepository airportRepository,
            FlightRepository flightRepository,
            AdminRepository adminRepository) {
        this.airlineRepository = airlineRepository;
        this.cityRepository = cityRepository;
        this.airportRepository = airportRepository;
        this.flightRepository = flightRepository;
        this.adminRepository = adminRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        seedAdmin();
        seedCoreData();
    }

    private void seedAdmin() {
        String adminEmail = "admin@skyair.com";
        Optional<Admin> adminOpt = adminRepository.findByEmail(adminEmail);

        if (adminOpt.isEmpty()) {
            Admin admin = new Admin();
            admin.setName("System Admin");
            admin.setEmail(adminEmail);
            admin.setPassword("123456");

            adminRepository.save(admin);
            System.out.println("Admin account created in Admin table: " + adminEmail);
        }
    }

    private void seedCoreData() {
        if (cityRepository.count() > 0)
            return;

        // Seed Cities
        City dacca = new City();
        dacca.setCityName("Dhaka");
        dacca.setCountry("Bangladesh");
        dacca = cityRepository.save(dacca);
        City chittagong = new City();
        chittagong.setCityName("Chittagong");
        chittagong.setCountry("Bangladesh");
        chittagong = cityRepository.save(chittagong);
        City dubai = new City();
        dubai.setCityName("Dubai");
        dubai.setCountry("UAE");
        dubai = cityRepository.save(dubai);

        // Seed Airlines
        Airline biman = new Airline();
        biman.setAirlineName("Biman Bangladesh");
        biman.setIataCode("BG");
        biman = airlineRepository.save(biman);
        Airline emirates = new Airline();
        emirates.setAirlineName("Emirates");
        emirates.setIataCode("EK");
        emirates = airlineRepository.save(emirates);

        // Seed Airports
        Airport hsac = new Airport();
        hsac.setAirportName("Hazrat Shahjalal International");
        hsac.setIataCode("DAC");
        hsac.setCityId(dacca.getCityId());
        hsac = airportRepository.save(hsac);
        Airport sa = new Airport();
        sa.setAirportName("Shah Amanat International");
        sa.setIataCode("CGP");
        sa.setCityId(chittagong.getCityId());
        sa = airportRepository.save(sa);
        Airport dxb = new Airport();
        dxb.setAirportName("Dubai International");
        dxb.setIataCode("DXB");
        dxb.setCityId(dubai.getCityId());
        dxb = airportRepository.save(dxb);

        // Seed Flights
        createFlight(biman, hsac, sa, "BG305", 1);
        createFlight(emirates, hsac, dxb, "EK585", 2);
        createFlight(biman, sa, hsac, "BG306", 3);

        System.out.println("Core data seeded successfully.");
    }

    private void createFlight(Airline airline, Airport origin, Airport dest, String flightNo, int dayOffset) {
        Flight flight = new Flight();
        flight.setAirlineId(airline.getAirlineId());
        flight.setOriginAirportId(origin.getAirportId());
        flight.setDestAirportId(dest.getAirportId());
        flight.setFlightNumber(flightNo);
        flight.setDepartureTime(LocalDateTime.now().plusDays(dayOffset).withHour(10).withMinute(0));
        flight.setArrivalTime(LocalDateTime.now().plusDays(dayOffset).withHour(13).withMinute(0));
        flight.setDurationMin(180);
        flight.setBaseFare(new BigDecimal("500.00"));
        flight.setEconomyFare(new BigDecimal("450.00"));
        flight.setBusinessFare(new BigDecimal("900.00"));
        flight.setAvailableSeats(150);
        flight.setStatus("SCHEDULED");
        flightRepository.save(flight);
    }
}

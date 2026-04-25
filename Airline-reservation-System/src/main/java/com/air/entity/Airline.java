package com.air.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "airlines")
public class Airline {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(name = "airline_id")
    private Long airlineId;
    @Column(name = "airline_name",nullable = false)

    private String airlineName;
    @Column(name = "iata_code",unique = true)
    private String iataCode;
    private String city;
    private String country;
    @Column(name = "contact_email",unique = true)
    private String contactEmail;
    @Column(name = "established_yr")
    private String establishedYr;

    public Long getAirlineId() {
        return airlineId;
    }

    public void setAirlineId(Long airlineId) {
        this.airlineId = airlineId;
    }

    public String getAirlineName() {
        return airlineName;
    }

    public void setAirlineName(String airlineName) {
        this.airlineName = airlineName;
    }

    public String getIataCode() {
        return iataCode;
    }

    public void setIataCode(String iataCode) {
        this.iataCode = iataCode;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getContactEmail() {
        return contactEmail;
    }

    public void setContactEmail(String contactEmail) {
        this.contactEmail = contactEmail;
    }

    public String getEstablishedYr() {
        return establishedYr;
    }

    public void setEstablishedYr(String establishedYr) {
        this.establishedYr = establishedYr;
    }
}

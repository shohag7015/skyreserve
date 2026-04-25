export interface Airport {
    airportId?: number;
    airportName: string;
    iataCode: string;
    country: string;
    cityId?: number;
    timezone: string;
    createdAt?: Date;
}

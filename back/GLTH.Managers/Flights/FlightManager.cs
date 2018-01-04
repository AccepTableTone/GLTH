using GLTH.Contracts;
using GLTH.Core.Data;
using GLTH.Core.Proxies;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace GLTH.Managers.Flights
{
    public class FlightManager
    {
        public static FlightSearchResponseDto SearchFlights(string origin, string destination)
        {
            //container for search results
            FlightSearchResponseDto response = new FlightSearchResponseDto();
            try
            {
                using (DBEntities dbConn = new DBEntities())
                {
                    //handle same airoprt search - client may not be checking
                    if (origin.Equals(destination, StringComparison.OrdinalIgnoreCase))
                    {
                        response.Flights = new List<FlightDto>();
                        response.Airports = new List<AirportDto>();
                        response.Airlines = new List<AirlineDto>();
                        response.UserMessage = "Origin and destination are the same airport.";

                        return response;
                    }

                    //get flights with matching origin and destination
                    var matchingFlights = FlightProxy.FindFlights(dbConn, origin, destination);

                    //return data
                    response.Flights = GetShortestFlightsByDistance(matchingFlights);
                    response.UserMessage = string.Format("{0} flights.", response.Flights.Count);

                    var iataCodes = response.Flights.SelectMany(q => q.Routes.Select(r => r.Destination)).Union(response.Flights.SelectMany(q => q.Routes.Select(r => r.Origin)));
                    var airlinesCodes = response.Flights.SelectMany(q => q.Routes.Select(r => r.Airline));

                    response.Airports = FlightProxy.GetAirports(dbConn, iataCodes);
                    response.Airlines = FlightProxy.GetAirlines(dbConn, airlinesCodes);
                }

                return response;
            }
            catch (Exception ex)
            {
                //log ex
                throw new Exception("Unexpected Error");
            }
        }

        private static List<FlightDto> GetShortestFlightsByDistance(List<List<RouteDto>> flights)
        {
            //determine distance of each flight
            var matchingFlights = flights.Select(q => new FlightDto()
                                    {
                                        Routes = q,
                                        TotalDistance = q.Sum(r => r.Distance)
                                    })
                                    .OrderBy(q => q.TotalDistance);

            List<FlightDto> shortestFlights = new List<FlightDto>();
            
            //matchingFlights is ordered by distance so shortest distance is the first item
            double shortestDistance = matchingFlights.FirstOrDefault().TotalDistance;
            foreach (var flight in matchingFlights)
                if (flight.TotalDistance == shortestDistance)
                    shortestFlights.Add(flight);

            return shortestFlights;
        }


        public static List<AirportDto> SearchAirports(string letters)
        {
            string searchLetters = HttpUtility.UrlDecode(letters);
            searchLetters = searchLetters.Replace(" ", ",").Replace(",,", ",").Replace(",", "*,") + "*";

            //check for string and length of string in case client isn't
            if (string.IsNullOrWhiteSpace(letters) || letters.Length < 3)
                return new List<AirportDto>();

            using (DBEntities dbConn = new DBEntities())
            {
                return FlightProxy.SearchAirports(dbConn, searchLetters);
            }
        }

        public static List<PopularFlightsAirportDto> GetPopularFlights()
        {
            using (DBEntities dbConn = new DBEntities())
            {
                return FlightProxy.GetPopularFlightsAirportList(dbConn);
            }

            
        }






        //one time utility functions used to create route distance data from airport longitude and latitude
        //version 1 used 'route' as unit of distance 
        //version 2 uses kilometers

        private static void AddDistance()
        {
            throw new Exception("Already been run >--[oo/]--<");

            using (DBEntities dbConn = new DBEntities())
            {
                var airports = dbConn.glth_airports.ToList();
                var routes = dbConn.glth_routes_w_distance;

                glth_airports origin = null;
                glth_airports destination = null;
                int count = 0;

                try
                {
                    foreach (var route in routes)
                    {
                        origin = airports.Where(q => q.iata.Equals(route.origin, StringComparison.OrdinalIgnoreCase)).FirstOrDefault();
                        destination = airports.Where(q => q.iata.Equals(route.destination, StringComparison.OrdinalIgnoreCase)).FirstOrDefault();

                        if (origin == null || destination == null)
                            continue;

                        //unit = kilometers
                        route.distance = Convert.ToDecimal(GetDistance(Convert.ToDouble(origin.lat), Convert.ToDouble(origin.lng), Convert.ToDouble(destination.lat), Convert.ToDouble(destination.lng)));
                        count = count + 1;
                    }
                }
                catch (Exception ex)
                {
                    throw;
                }

                dbConn.SaveChanges();
            }
        }

        private static double GetDistance(double originLat, double originLng, double destinationLat, double destinationLng)
        {
            //Assuming Earth is a perfect sphere of radius 6371.2 km
            //http://gc.kls2.com/faq.html#$gc-calc

            //convert to radians
            originLat = ConvertToRadians(originLat);
            originLng = ConvertToRadians(originLng);
            destinationLat = ConvertToRadians(destinationLat);
            destinationLng = ConvertToRadians(destinationLng);

            var theta = destinationLng - originLng;
            var distance = Math.Acos(   Math.Sin(originLat) * 
                                        Math.Sin(destinationLat) + 
                                        Math.Cos(originLat) * 
                                        Math.Cos(destinationLat) * 
                                        Math.Cos(theta)
                                    );

            if (distance < 0)
                distance += Math.PI;

            return Math.Round(distance * 6371.2, 2);
        }

        private static double ConvertToRadians(double value)
        {
            return value * (Math.PI / 180);
        }
    }
}

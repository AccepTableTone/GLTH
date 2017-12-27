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
                        response.Flights = new List<List<RouteDto>>();
                        response.Airports = new List<AirportDto>();
                        response.Airlines = new List<AirlineDto>();
                        response.UserMessage = "Origin and destination are the same airport.";

                        return response;
                    }

                    response.Flights = FlightProxy.FindFlights(dbConn, origin, destination);
                    response.UserMessage = string.Format("{0} flights.", response.Flights.Count);

                    var iataCodes = response.Flights.SelectMany(q => q.Select(r => r.Destination)).Union(response.Flights.SelectMany(q => q.Select(r => r.Origin)));
                    var airlinesCodes = response.Flights.SelectMany(q => q.Select(r => r.Airline));

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
    }
}

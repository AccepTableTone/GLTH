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
                    response.Flights = FlightProxy.FindFlights(dbConn, origin, destination);

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

                response.Flights = null;
                response.Airports = null;
                response.Airlines = null;
                response.UserMessage = string.Format("MESSAGE:{0}<BR><BR>STACK{1}", ex.Message, ex.StackTrace);
                //response.UserMessage = "Sorry, there was an unexpected error. Please try again.";
                return response;
            }
        }

        public static List<AirportDto> SearchAirports(string letters)
        {
            string searchLetters = HttpUtility.UrlDecode(letters);
            searchLetters = searchLetters.Replace(" ", ",").Replace(",,", ",").Replace(",", "*,") + "*";
            
            using (DBEntities dbConn = new DBEntities())
            {
                return FlightProxy.SearchAirports(dbConn, searchLetters);
            }
        }
    }
}

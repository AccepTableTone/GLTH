using GLTH.Contracts;
using GLTH.Core.Data;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GLTH.Core.Proxies
{
    public class FlightProxy
    {
        public static List<List<RouteDto>> FindFlights(DBEntities dbConn, string orig, string dest)
        {
            //results holder - could have multiple flight options of the same route length
            List<List<RouteDto>> finalFlightRoutes = new List<List<RouteDto>>();

            //get the routes that start at the origin 
            var firstRoutes = dbConn.glth_routes
                            .Where(q => q.origin.Equals(orig, StringComparison.OrdinalIgnoreCase))
                            .Select(q => new RouteDto() {
                                Airline = q.airlinetwolettercode,
                                Origin = q.origin,
                                Destination = q.destination
                            })
                            .ToList();

            //is this a one leg flight - do we have a leg with the requested origin and destination
            var oneLegRoutes = firstRoutes.Where(q => q.Destination.Equals(dest, StringComparison.OrdinalIgnoreCase)).ToList();
            if (oneLegRoutes.Any())
                return RouteListToListOfRouteLists(oneLegRoutes);

            //** could change initial database pull to also include routes with the requested destination - .Where(q => q.destination.Equals(dest))
            //** with the extra destination filter we could check for one leg and 2 leg trips at the cost of one db trip - data size and analytics would clear up what to do

            //this trip is more than one leg
            //loop through routes to find routes that end at requested destination
            return GetMultiLegTrips(dbConn, RouteListToListOfRouteLists(firstRoutes), dest, firstRoutes.Select(q => q.Destination).Distinct().ToList(), finalFlightRoutes);
        }

        //we want each trip to be a list of routes - we will add routes as we loop through options
        //this utility method will turn a route list into a list of route lists so we can append each route to each trip option
        private static List<List<RouteDto>> RouteListToListOfRouteLists(List<RouteDto> list)
        {
            List<List<RouteDto>> listOfLists = new List<List<RouteDto>>();
            foreach (var item in list)
            {
                List<RouteDto> tmp = new List<RouteDto>();
                tmp.Add(item);
                listOfLists.Add(tmp);
            }

            return listOfLists;
        }

        //get the posible routes of flights that have at least one connection route
        private static List<List<RouteDto>> GetMultiLegTrips(DBEntities dbConn, List<List<RouteDto>> startingRoutes, string finalDestination, List<string> visitedAirports, List<List<RouteDto>> finalRoutes)
        {
            //get the next list of route options
            List<RouteDto> nextRoutes = GetNextLegRoutes(dbConn, startingRoutes.Select(q => q[q.Count - 1]).ToList(),  visitedAirports);
            //update list of visited airports 
            visitedAirports = visitedAirports.Union(nextRoutes.Select(q => q.Destination)).Distinct().ToList();

            //the new list of routes for flights that have not reached finalDestination
            List<List<RouteDto>> newStartingRoutes = new List<List<RouteDto>>();

            //looop though the current list of starting routes
            foreach (var route in startingRoutes)
            {
               //do any  of the nextlegs origin match this startingleg's destination
                var newOrig = route[route.Count - 1].Destination;
                var routeOptions = nextRoutes.Where(q => q.Origin.Equals(newOrig, StringComparison.OrdinalIgnoreCase)).ToList();

                //is there another leg this route can follow
                if (routeOptions.Any()) {
                    foreach (RouteDto routeLeg in routeOptions)
                    {
                        //does this new leg make a complete trip
                        if (routeLeg.Destination.Equals(finalDestination, StringComparison.OrdinalIgnoreCase))
                        {
                            //can't pass route lists around by reference so clone it
                            var newRouteList = CloneRouteList(route);
                            newRouteList.Add(routeLeg);
                            finalRoutes.Add(newRouteList);
                        }
                        //this leg doesn't hit the destination so add it to the new list of starting routes
                        else
                        {
                            //can't pass route lists around by reference so clone it
                            var newRouteList = CloneRouteList(route);
                            newRouteList.Add(routeLeg);
                            newStartingRoutes.Add(newRouteList);
                        }
                    }
                }
            }

            //if we don't have a trip that reaches the final destination and we have some routes we can still follow then do it all again 0-[.__.]-0
            if (finalRoutes.Count == 0 && newStartingRoutes.Count > 0)
                GetMultiLegTrips(dbConn, newStartingRoutes, finalDestination, visitedAirports, finalRoutes);

            return finalRoutes;
        }

        //clone a list
        private static List<RouteDto> CloneRouteList(List<RouteDto> routes) 
        {
            RouteDto[] arRoutes = (RouteDto[])routes.ToArray().Clone();
            return new List<RouteDto>(arRoutes);
        }

        //get list of possible routes from list of origins
        private static List<RouteDto> GetNextLegRoutes(DBEntities dbConn, List<RouteDto> lastRoutes, List<string> visitedAirports)
        {
            //get the next set of routes starting from where the lastRoutes ended
            var newOrigins = lastRoutes.Select(r => r.Destination);
            //we filter by visited airports so we don;t end up going backwards
            var newRoutes = dbConn.glth_routes
                            .Where(q => !visitedAirports.Contains(q.destination))
                            .Where(q => newOrigins.Contains(q.origin))
                            .Select(q => new RouteDto()
                            {
                                Airline = q.airlinetwolettercode,
                                Origin = q.origin,
                                Destination = q.destination
                            })
                            .ToList();

            return newRoutes;
        }

        //get list of airports by list of airport codes
        public static List<AirportDto> GetAirports(DBEntities dbConn, IEnumerable<string> iataCodes)
        {
            return dbConn.glth_airports
                            .Where(q=> iataCodes.Contains(q.iata))
                            .Select(q => new AirportDto()
                            {
                                Name = q.name,
                                City = q.city,
                                Country = q.country,
                                IATA = q.iata
                            })
                            .OrderBy(q => q.City)
                            .ThenBy(q => q.Country)
                            .ToList();
        }

        //get list of airlines by airline codes
        public static List<AirlineDto> GetAirlines(DBEntities dbConn, IEnumerable<string> airlineCodes)
        {
            return dbConn.glth_airlines
                            .Where(q => airlineCodes.Contains(q.twodigitcode))
                            .Select(q => new AirlineDto()
                            {
                                Name = q.name,
                                Code = q.twodigitcode
                            })
                            .ToList();
        }

        //search airports for autocomplete (sp searches airport name, city and iata code)
        public static List<AirportDto> SearchAirports(DBEntities dbConn, string letters)
        {
            return dbConn.Database.SqlQuery<AirportDto>(string.Format("CALL SearchAirports('{0}')", letters)).ToList<AirportDto>();
        }
    }
}

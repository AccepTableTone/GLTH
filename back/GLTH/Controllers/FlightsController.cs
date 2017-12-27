using GLTH.Contracts;
using GLTH.Managers.Flights;
using System.Collections.Generic;
using System.Web.Http;

namespace GLTH.Api.Controllers
{
    public class FlightsController : ApiController
    {
        [System.Web.Http.HttpGet]
        [Route("api/flights/{origin}/{destination}")]
        public FlightSearchResponseDto Flights(string origin, string destination)
        {
            var tmp = FlightManager.SearchFlights(origin, destination);
            return tmp;
        }


        [System.Web.Http.HttpGet]
        [Route("api/airports/{keyword}")]
        public List<AirportDto> SearchAirports(string keyword)
        {
            return FlightManager.SearchAirports(keyword);
        }

        [System.Web.Http.HttpGet]
        [Route("api/popularflights")]
        public List<PopularFlightsAirportDto> PopularFlights()
        {
            return FlightManager.GetPopularFlights();
        }

    }
}

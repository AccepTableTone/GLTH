using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GLTH.Contracts
{
    public class PopularFlightsAirportDto : AirportDto
    {
        public static string IS_ORIGIN = "IS_ORIGIN";
        public static string IS_DESTINATION = "IS_DESTINATION";

        public string AirportType { get; set; }
    }

    public enum FlightType
    {
        Origin,
        Destination
    }
}

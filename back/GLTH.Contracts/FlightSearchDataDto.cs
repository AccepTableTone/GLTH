using GLTH.Contracts;
using System.Collections.Generic;

namespace GLTH.Contracts
{
    public class FlightSearchDataDto
    {
        public List<AirlineDto> Airlines { get; set; }
        public List<AirportDto> Airports { get; set; }
    }
}

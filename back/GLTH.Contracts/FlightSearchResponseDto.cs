using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GLTH.Contracts
{
    public class FlightSearchResponseDto
    {
        public List<AirlineDto> Airlines { get; set; }
        public List<AirportDto> Airports { get; set; }
        public List<FlightDto> Flights { get; set; }
        public string UserMessage { get; set; }
    }
}

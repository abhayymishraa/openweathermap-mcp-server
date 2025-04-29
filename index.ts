import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { currentWeather, forecastWeather } from "./api";
import { z } from "zod";

const baseReturnedPrompt = `This response is returned from the api you need to parse it the following is the data returned from api: `;

const server = new McpServer({
  name: "WeatherAPI",
  version: "1.0.0",
});

server.tool(
  "get-current-weather-from-lagtitude-and-longitude",
  "Get comprehensive weather data including temperature, pressure, humidity, visibility, wind details, and weather conditions for a specific location",
  {
    latitude: z.number(),
    longitude: z.number(),
  },

  async ({ latitude, longitude }) => {
    const data = await currentWeather(latitude, longitude);
    return {
      content: [
        {
          type: "text",
          text: baseReturnedPrompt + JSON.stringify(data),
        },
      ],
    };
  }
);

server.tool(
  "get-next-5days-forecast-weather-from-lagtitude-and-longitude",
  "Get 5-day weather forecast data including temperature, pressure, humidity, visibility, wind details, and weather conditions for a specific location based on the latitude and longitude",
  {
    latitude: z.number(),
    longitude: z.number(),
  },
  async ({ latitude, longitude }) => {
    const data = await forecastWeather(latitude, longitude);
    return {
      content: [
        {
          type: "text",
          text: baseReturnedPrompt + JSON.stringify(data),
        },
      ],
    };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);

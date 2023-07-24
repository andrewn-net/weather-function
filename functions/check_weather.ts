import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

import { config } from "../config.ts";

/**
 * Functions are reusable building blocks of automation that accept
 * inputs, perform calculations, and provide outputs. Functions can
 * be used independently or as steps in workflows.
 * https://api.slack.com/automation/functions/custom
 */
export const CheckWeatherDefinition = DefineFunction({
  callback_id: "check_weather",
  title: "Send Weather Report",
  description: "Check weather conditions based on location",
  source_file: "functions/check_weather.ts",
  input_parameters: {
    properties: {
      channel: {
        type: Schema.slack.types.channel_id,
        description: "Send to channel",
      },
      location: {
        type: Schema.types.string,
        description: "Location",
      },
    },
    required: ["location", "channel"],
  },
  output_parameters: {
    properties: {},
    required: [],
  },
});

export default SlackFunction(
  CheckWeatherDefinition,
  async ({ inputs, client }) => {
    try {
      const location = inputs.location;
      const apiKey = config.API_TOKEN; // Update .env with your Tomorrow.io API key

      const url = `https://api.tomorrow.io/v4/timelines?location=${
        encodeURIComponent(location)
      }&fields=temperature,cloudCover,cloudBase,windSpeed,windDirection&timesteps=1h&units=metric&apikey=${apiKey}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Request failed");
      }

      const responseData = await response.json();

      const currentTemperature =
        responseData.data.timelines[0].intervals[0].values.temperature;
      const currentCloudCover =
        responseData.data.timelines[0].intervals[0].values.cloudCover;
      const currentcloudBase =
        responseData.data.timelines[0].intervals[0].values.cloudBase;
      const currentwindSpeed =
        responseData.data.timelines[0].intervals[0].values.windSpeed;
      const currentwindDirection =
        responseData.data.timelines[0].intervals[0].values.windDirection;

      const message =
        `Weather report for ${location}\n\nCurrent temperature: ${currentTemperature}°C\nCurrent cloud cover: ${currentCloudCover}%\nCurrent cloud base: ${currentcloudBase} km\nCurrent wind speed: ${currentwindSpeed} m/s\nCurrent wind direction: ${currentwindDirection}°`;

      await client.chat.postMessage({
        channel: inputs.channel,
        text: message,
      });
    } catch (error) {
      console.error(
        "An error occurred while retrieving the weather:",
        error.message,
      );
    }

    return { outputs: {} };
  },
);

import { Manifest } from "deno-slack-sdk/mod.ts";
import { CheckWeatherDefinition } from "./functions/check_weather.ts";

/**
 * The app manifest contains the app's configuration. This
 * file defines attributes like app name and description.
 * https://api.slack.com/automation/manifest
 */
export default Manifest({
  name: "Weather",
  description: "Send Weather Report",
  icon: "assets/weather-icon.png",
  workflows: [],
  functions: [CheckWeatherDefinition],
  outgoingDomains: ["api.tomorrow.io"],
  datastores: [],
  botScopes: [
    "commands",
    "chat:write",
    "chat:write.public",
    "datastore:read",
    "datastore:write",
    "chat:write.customize",
  ],
});

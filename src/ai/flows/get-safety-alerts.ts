// src/ai/flows/get-safety-alerts.ts
'use server';
/**
 * @fileOverview A flow to get safety alerts based on weather data.
 *
 * - getSafetyAlerts - A function that returns safety alerts for a location.
 * - GetSafetyAlertsInput - The input type for the getSafetyAlerts function.
 * - GetSafetyAlertsOutput - The return type for the getSafetyAlerts function.
 */

import { ai } from '@/ai/genkit';
import { getWeather, WeatherDataSchema } from '@/services/weather';
import { z } from 'genkit';

const GetSafetyAlertsInputSchema = z.object({
  location: z.string().describe('The location to get weather alerts for (e.g., "Srisailam").'),
});
export type GetSafetyAlertsInput = z.infer<typeof GetSafetyAlertsInputSchema>;

const GetSafetyAlertsOutputSchema = z.object({
    status: z.enum(['All Clear', 'Warning', 'Danger']).describe("A concise status of the current conditions."),
    summary: z.string().describe('A short, human-readable summary of the weather conditions and any warnings.'),
    temperature: z.number().describe("The current temperature in Celsius."),
    weatherCondition: z.string().describe("A brief description of the current weather (e.g., 'Clear', 'Rain')."),
    isGhatOpen: z.boolean().describe("Whether the ghat road is likely open based on weather."),
});
export type GetSafetyAlertsOutput = z.infer<typeof GetSafetyAlertsOutputSchema>;


const weatherTool = ai.defineTool(
    {
      name: 'getWeather',
      description: 'Gets the current weather for a given location.',
      inputSchema: z.object({ location: z.string() }),
      outputSchema: WeatherDataSchema,
    },
    async (input) => getWeather(input.location)
);

const safetyAlertsPrompt = ai.definePrompt({
    name: 'safetyAlertsPrompt',
    tools: [weatherTool],
    prompt: `You are a travel safety assistant for a pilgrimage to Srisailam. Your primary role is to provide clear and concise safety alerts based on weather data.

    Location: {{{location}}}
    
    1.  Use the getWeather tool to get the current weather conditions for the location.
    2.  Analyze the weather data (temperature, conditions, wind speed, rain volume).
    3.  Determine a safety status:
        *   'All Clear': Good weather, no significant risks.
        *   'Warning': Moderate issues like heavy rain, strong winds. Advise caution.
        *   'Danger': Severe conditions like storms, very heavy rain. Advise against travel on ghat roads.
    4.  Write a brief, one-sentence summary of the situation.
    5.  Based on the weather, determine if the ghat road is likely open. It should be closed for 'Danger' status.
    6.  Output the current temperature in Celsius.
    
    Provide a response in the required JSON format.`,
});

const getSafetyAlertsFlow = ai.defineFlow(
  {
    name: 'getSafetyAlertsFlow',
    inputSchema: GetSafetyAlertsInputSchema,
    outputSchema: GetSafetyAlertsOutputSchema,
  },
  async (input) => {
    const llmResponse = await safetyAlertsPrompt(input);
    const toolRequest = llmResponse.toolRequest();

    if (!toolRequest) {
        throw new Error('Expected a tool request to get weather data.');
    }
    
    const toolResponse = await toolRequest.run();

    const finalResponse = await llmResponse.continue(toolResponse);

    const safetyAlerts = finalResponse.output();
    if (!safetyAlerts) {
      throw new Error('Could not generate safety alerts.');
    }
    return safetyAlerts;
  }
);


export async function getSafetyAlerts(input: GetSafetyAlertsInput): Promise<GetSafetyAlertsOutput> {
    return getSafetyAlertsFlow(input);
}

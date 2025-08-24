// src/ai/flows/generate-itinerary.ts
'use server';
/**
 * @fileOverview Generates a personalized 3-day trip itinerary for Srisailam pilgrimage.
 *
 * - generateItinerary - A function that generates the itinerary.
 * - GenerateItineraryInput - The input type for the generateItinerary function.
 * - GenerateItineraryOutput - The return type for the generateItinerary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateItineraryInputSchema = z.object({
  from: z.string().describe('The starting location of the trip (city or GPS coordinates).'),
  arrive_datetime: z.string().describe('The arrival date and time at Srisailam (ISO format).'),
  group_size: z.number().describe('The number of people in the group.'),
  hotel: z.string().nullable().describe('The name of the hotel (if chosen, otherwise null).'),
  language: z.enum(['Hindi', 'English']).describe('The preferred language for the itinerary.'),
  weather_alerts: z.string().nullable().describe('A short summary of weather alerts (if any, otherwise null).'),
});
export type GenerateItineraryInput = z.infer<typeof GenerateItineraryInputSchema>;

const GenerateItineraryOutputSchema = z.object({
  itinerary: z.string().describe('A human-readable itinerary paragraph in the requested language.'),
  packing_checklist: z.string().describe('A packing checklist (bullet list).'),
  calendar_events: z.string().describe('Calendar events as JSON array [{title,start,end,notes}].'),
  safety_note: z.string().describe('One short travel safety note based on weather_alerts.'),
});
export type GenerateItineraryOutput = z.infer<typeof GenerateItineraryOutputSchema>;

export async function generateItinerary(input: GenerateItineraryInput): Promise<GenerateItineraryOutput> {
  return generateItineraryFlow(input);
}

const itineraryPrompt = ai.definePrompt({
  name: 'itineraryPrompt',
  input: {schema: GenerateItineraryInputSchema},
  output: {schema: GenerateItineraryOutputSchema},
  prompt: `You are a friendly travel assistant. Create a concise 3-day itinerary for a family visiting Mallikarjuna (Srisailam).
Input JSON:
{
  "from": "{{{from}}}",
  "arrive_datetime": "{{{arrive_datetime}}}",
  "group_size": {{{group_size}}},
  "hotel": "{{{hotel}}}",
  "language": "{{{language}}}",
  "weather_alerts": "{{{weather_alerts}}}"
}
Return:
1) A human-readable itinerary paragraph in the requested language.
2) A packing checklist (bullet list).
3) Calendar events as JSON array [{
    title: string,
    start: string, //ISO format
    end: string, //ISO format
    notes: string
}].
4) One short travel safety note based on weather_alerts.
Keep each section short and scannable. Maximum total tokens 600.`,
});

const generateItineraryFlow = ai.defineFlow(
  {
    name: 'generateItineraryFlow',
    inputSchema: GenerateItineraryInputSchema,
    outputSchema: GenerateItineraryOutputSchema,
  },
  async input => {
    const {output} = await itineraryPrompt(input);
    return output!;
  }
);

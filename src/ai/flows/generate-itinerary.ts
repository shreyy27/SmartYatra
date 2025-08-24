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
  prompt: `You are an expert travel planner specializing in pilgrimage trips to Srisailam. Create a detailed and practical 3-day itinerary for a group.

**User Details:**
*   **From:** {{{from}}}
*   **Arrival:** {{{arrive_datetime}}}
*   **Group Size:** {{{group_size}}} people
*   **Hotel:** {{{hotel}}} (or "not specified")
*   **Language:** {{{language}}}
*   **Weather Alerts:** {{{weather_alerts}}}

**Your Task:**

1.  **Detailed Itinerary:**
    *   Create a 3-day itinerary with specific time slots (e.g., 9:00 AM - 11:00 AM).
    *   Include main temple visits (like Sparsha Darshan, Abhishekam), local sightseeing (e.g., Sakshi Ganapathi, Paladhara Panchadara, Dam), and ropeway/boating if time permits.
    *   Suggest realistic travel times between locations.
    *   Recommend meal times and suggest types of local food to try.
    *   Format it clearly with Day 1, Day 2, Day 3 headings.

2.  **Packing Checklist:**
    *   Create a comprehensive bulleted list of essential items.
    *   Include clothing suitable for the dress code (Dhoti/Kurta for men, Saree/Salwar for women), toiletries, first-aid, and any specific items needed for rituals.

3.  **Calendar Events (JSON):**
    *   Generate a JSON array of calendar events. Each event must have \`title\`, \`start\` (ISO format), \`end\` (ISO format), and descriptive \`notes\`.

4.  **Safety Note:**
    *   Provide a practical safety tip based on the provided \`weather_alerts\` or general travel advice for Srisailam (e.g., hydration, ghat road driving).

**Output Style:**
*   Respond in the requested language ({{{language}}}).
*   The tone should be helpful, respectful, and encouraging.
*   Total response should be detailed but easy to read. Aim for a token count around 800-1000 to provide sufficient detail.`,
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

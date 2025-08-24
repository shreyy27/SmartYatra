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
});
export type GenerateItineraryInput = z.infer<typeof GenerateItineraryInputSchema>;

const ItineraryEventSchema = z.object({
    day: z.number().describe("The day number of the event (e.g., 1, 2, or 3)."),
    time: z.string().describe("The time slot for the activity (e.g., '09:00 AM - 11:00 AM')."),
    activity: z.string().describe("The name of the activity or event."),
    description: z.string().describe("A brief description of the activity and any relevant notes (e.g., 'Main temple visit for Sparsha Darshan. Dress code applies.').")
});

const GenerateItineraryOutputSchema = z.object({
  itinerary: z.array(ItineraryEventSchema).describe("A detailed 3-day itinerary as a list of events. Each event must be an object with day, time, activity, and description."),
  packing_checklist: z.string().describe('A packing checklist as a bulleted list. Do not use markdown formatting like asterisks for bolding.'),
  safety_note: z.string().describe('One short, practical travel safety note for Srisailam (e.g., hydration, ghat road driving).'),
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
*   **Arrival Date & Time:** {{{arrive_datetime}}}
*   **Group Size:** {{{group_size}}} people
*   **Hotel:** {{{hotel}}} (or "not specified")
*   **Language:** {{{language}}}

**Your Task:**

1.  **Detailed Itinerary (JSON Table Format):**
    *   Create a 3-day itinerary as a JSON array of events.
    *   The first event on Day 1 should be based on the user's arrival time. For example, if they arrive in the morning, the first activity could be "Hotel Check-in and Freshen up". If they arrive in the afternoon, it might be lunch followed by check-in.
    *   Each event object must have four keys: "day", "time", "activity", and "description".
    *   Include main temple visits (like Sparsha Darshan, Abhishekam), local sightseeing (e.g., Sakshi Ganapathi, Paladhara Panchadara, Dam), and ropeway/boating if time permits.
    *   Suggest realistic travel times and include meal times.
    *   Example for one event: \`{"day": 1, "time": "04:00 PM - 05:00 PM", "activity": "Check-in to Hotel", "description": "Settle in and freshen up after your journey."}\`

2.  **Packing Checklist:**
    *   Create a comprehensive bulleted list of essential items.
    *   Include clothing suitable for the dress code (Dhoti/Kurta for men, Saree/Salwar for women), toiletries, first-aid, etc.

3.  **Safety Note:**
    *   Provide a single, practical safety tip for Srisailam (e.g., ghat road driving, hydration).

**Output Style:**
*   Respond in the requested language ({{{language}}}).
*   The tone should be helpful and respectful.
*   **IMPORTANT**: Do not use any markdown formatting like asterisks for bolding or lists in the checklist. Use plain text and newlines. The itinerary must be a valid JSON array.`,
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

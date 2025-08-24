'use server';

/**
 * @fileOverview Voice assistant flow for handling user voice queries.
 *
 * - voiceAssistant - A function that handles voice queries and returns a response.
 * - VoiceAssistantInput - The input type for the voiceAssistant function.
 * - VoiceAssistantOutput - The return type for the voiceAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VoiceAssistantInputSchema = z.object({
  transcribedText: z
    .string()
    .describe('The transcribed text from the user voice query.'),
  language: z
    .enum(['Hindi', 'English'])
    .describe('The language of the user query.'),
  tripDetails: z
    .string()
    .optional()
    .describe('User trip details stored in DB (from, dates, hotel if chosen)'),
  currentAlerts: z
    .string()
    .optional()
    .describe('Current weather and road alerts.'),
});
export type VoiceAssistantInput = z.infer<typeof VoiceAssistantInputSchema>;

const VoiceAssistantOutputSchema = z.object({
  type: z.enum(['action', 'info', 'clarify']).describe('The type of response.'),
  responseText: z.string().describe('The response text to be spoken to the user.'),
  followup: z.string().nullable().describe('A clarifying question if needed.'),
  teluguPhrase: z
    .object({
      teluguText: z.string(),
      transliteration: z.string(),
      ttsLang: z.string(),
    })
    .nullable()
    .describe('Telugu translation of a common phrase, if applicable.'),
});
export type VoiceAssistantOutput = z.infer<typeof VoiceAssistantOutputSchema>;

export async function voiceAssistant(input: VoiceAssistantInput): Promise<VoiceAssistantOutput> {
  return voiceAssistantFlow(input);
}

const voiceAssistantPrompt = ai.definePrompt({
  name: 'voiceAssistantPrompt',
  input: {schema: VoiceAssistantInputSchema},
  output: {schema: VoiceAssistantOutputSchema},
  prompt: `You are an assistant for SmartYatra Companion. User question: "{{transcribedText}}"
Context: user trip details stored in DB ({{tripDetails}}) and current alerts ({{currentAlerts}}).
1) If the question is an action (e.g., "Find nearest hotels from Pune"), respond with a short plan of action and call the hotel search API.
2) If it's an info question (e.g., "What to wear for sparsha darshan?"), return the exact static darshan content answer in the user's language.
3) If uncertain, ask a single clarifying question (only one).
Return: { "type": "action"|"info"|"clarify", "response_text": "...", "followup": null }


Translate the short phrase \"{{transcribedText}}\" into polite, short Telugu suitable for showing to a shopkeeper or guard. Keep it under 10 words. Provide transliteration in Latin letters and generate a short TTS-friendly sentence. Also provide a recommended audio voice language tag.
Return JSON: { "telugu_text": "...", "transliteration": "...", "tts_lang": "te-IN" }
`,
});

const voiceAssistantFlow = ai.defineFlow(
  {
    name: 'voiceAssistantFlow',
    inputSchema: VoiceAssistantInputSchema,
    outputSchema: VoiceAssistantOutputSchema,
  },
  async input => {
    const {output} = await voiceAssistantPrompt(input);
    return output!;
  }
);



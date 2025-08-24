// src/ai/flows/translate-telugu-phrase.ts
'use server';
/**
 * @fileOverview A flow to translate phrases into Telugu.
 *
 * - translateToTelugu - A function that translates a given phrase into Telugu.
 * - TranslateToTeluguInput - The input type for the translateToTelugu function.
 * - TranslateToTeluguOutput - The return type for the translateToTelugu function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateToTeluguInputSchema = z.object({
  phrase: z.string().describe('The phrase to translate to Telugu.'),
});
export type TranslateToTeluguInput = z.infer<typeof TranslateToTeluguInputSchema>;

const TranslateToTeluguOutputSchema = z.object({
  teluguText: z.string().describe('The translated phrase in Telugu script.'),
  transliteration: z.string().describe('An English transliteration of the Telugu phrase to help with pronunciation.'),
});
export type TranslateToTeluguOutput = z.infer<typeof TranslateToTeluguOutputSchema>;

export async function translateToTelugu(input: TranslateToTeluguInput): Promise<TranslateToTeluguOutput> {
  return translateToTeluguFlow(input);
}

const translatePrompt = ai.definePrompt({
  name: 'translateToTeluguPrompt',
  input: {schema: TranslateToTeluguInputSchema},
  output: {schema: TranslateToTeluguOutputSchema},
  prompt: `You are a helpful translation assistant. Translate the following English phrase into polite, everyday Telugu. Also, provide a simple English transliteration.

Phrase: "{{{phrase}}}"

Keep the translation natural and easy for a traveler to use when speaking to a local person.`,
});

const translateToTeluguFlow = ai.defineFlow(
  {
    name: 'translateToTeluguFlow',
    inputSchema: TranslateToTeluguInputSchema,
    outputSchema: TranslateToTeluguOutputSchema,
  },
  async input => {
    const {output} = await translatePrompt(input);
    return output!;
  }
);

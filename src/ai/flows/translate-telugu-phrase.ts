// This file is machine-generated - edit at your own risk.

'use server';

/**
 * @fileOverview A flow to translate phrases into Telugu.
 *
 * - translateTeluguPhrase - A function that translates a given phrase into Telugu.
 * - TranslateTeluguPhraseInput - The input type for the translateTeluguPhrase function.
 * - TranslateTeluguPhraseOutput - The return type for the translateTeluguPhrase function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateTeluguPhraseInputSchema = z.object({
  phrase: z.string().describe('The phrase to translate to Telugu.'),
});
export type TranslateTeluguPhraseInput = z.infer<typeof TranslateTeluguPhraseInputSchema>;

const TranslateTeluguPhraseOutputSchema = z.object({
  teluguText: z.string().describe('The translated phrase in Telugu.'),
  transliteration: z.string().describe('The transliteration of the Telugu phrase.'),
  ttsLang: z.string().describe('The language tag for Telugu TTS (te-IN).'),
});
export type TranslateTeluguPhraseOutput = z.infer<typeof TranslateTeluguPhraseOutputSchema>;

export async function translateTeluguPhrase(input: TranslateTeluguPhraseInput): Promise<TranslateTeluguPhraseOutput> {
  return translateTeluguPhraseFlow(input);
}

const translateTeluguPhrasePrompt = ai.definePrompt({
  name: 'translateTeluguPhrasePrompt',
  input: {schema: TranslateTeluguPhraseInputSchema},
  output: {schema: TranslateTeluguPhraseOutputSchema},
  prompt: `Translate the short phrase "{{{phrase}}}" into polite, short Telugu suitable for showing to a shopkeeper or guard. Keep it under 10 words. Provide transliteration in Latin letters and generate a short TTS-friendly sentence. Also provide a recommended audio voice language tag.\nReturn JSON: { "telugu_text": "...", "transliteration": "...", "tts_lang": "te-IN" }`,
});

const translateTeluguPhraseFlow = ai.defineFlow(
  {
    name: 'translateTeluguPhraseFlow',
    inputSchema: TranslateTeluguPhraseInputSchema,
    outputSchema: TranslateTeluguPhraseOutputSchema,
  },
  async input => {
    const {output} = await translateTeluguPhrasePrompt(input);
    return output!;
  }
);

import { config } from 'dotenv';
config({ path: '.env.local' });

import '@/ai/flows/voice-assistant.ts';
import '@/ai/flows/translate-telugu-phrase.ts';
import '@/ai/flows/generate-itinerary.ts';

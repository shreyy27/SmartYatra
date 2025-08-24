// src/app/translate/page.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { translateToTelugu, TranslateToTeluguOutput } from '@/ai/flows/translate-telugu-phrase';
import { Loader2, Languages } from 'lucide-react';

export default function TranslatePage() {
  const [phrase, setPhrase] = useState('');
  const [translation, setTranslation] = useState<TranslateToTeluguOutput | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const { toast } = useToast();

  const handleTranslate = async () => {
    if (!phrase.trim()) {
      toast({
        variant: 'destructive',
        title: 'Input Required',
        description: 'Please enter a phrase to translate.',
      });
      return;
    }

    setIsTranslating(true);
    setTranslation(null);
    try {
      const result = await translateToTelugu({ phrase });
      setTranslation(result);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Translation Error',
        description: 'Could not translate the phrase. Please try again.',
      });
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="container py-8 md:py-12">
      <div className="mx-auto max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="font-headline text-4xl font-bold">Telugu Translator</h1>
          <p className="text-muted-foreground mt-2">
            Translate common English phrases to Telugu for your trip.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Translate a Phrase</CardTitle>
            <CardDescription>
              Enter a short phrase in English that you'd like to use in Srisailam.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="e.g., 'How much is this?'"
                value={phrase}
                onChange={(e) => setPhrase(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleTranslate()}
                disabled={isTranslating}
              />
              <Button onClick={handleTranslate} disabled={isTranslating}>
                {isTranslating ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Languages />
                )}
                <span className="ml-2 hidden md:inline">Translate</span>
              </Button>
            </div>

            {isTranslating && (
              <div className="flex items-center justify-center gap-4 rounded-lg bg-muted p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Translating...</p>
              </div>
            )}

            {translation && (
              <div className="space-y-6 rounded-lg border bg-background p-6 animate-in fade-in-50">
                <div>
                  <h3 className="font-headline text-lg text-muted-foreground">Telugu Translation</h3>
                  <p className="font-sans text-3xl font-bold text-primary">{translation.teluguText}</p>
                </div>
                <div>
                  <h3 className="font-headline text-lg text-muted-foreground">How to Pronounce (Transliteration)</h3>
                  <p className="text-lg italic text-foreground">{translation.transliteration}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

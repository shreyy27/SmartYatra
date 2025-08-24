'use client'

import { Button } from '@/components/ui/button'
import { Mic } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
  SheetFooter
} from '@/components/ui/sheet'
import { Textarea } from './ui/textarea'
import { useState, useEffect } from 'react'

const Waveform = () => {
  const [heights, setHeights] = useState<number[]>(Array(30).fill(4));

  useEffect(() => {
    const interval = setInterval(() => {
      setHeights(heights.map(() => Math.floor(Math.random() * 36) + 4));
    }, 200);
    return () => clearInterval(interval);
  }, [heights]);

  return (
    <div className="flex items-center justify-center h-20 w-full bg-muted/50 rounded-lg">
      <div className="flex items-center justify-center gap-1 h-10">
        {heights.map((height, i) => (
          <div
            key={i}
            className="w-1 bg-primary/70 rounded-full"
            style={{ height: `${height}px`, transition: 'height 0.15s ease-in-out' }}
          />
        ))}
      </div>
    </div>
  );
};


export function VoiceAssistant() {
  const [isRecording, setIsRecording] = useState(false)
  const [transcribedText, setTranscribedText] = useState('')
  const [response, setResponse] = useState<{ text: string; audio: string | null } | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])
  
  if (!isClient) {
    return null
  }

  const handleRecordToggle = () => {
    const recording = !isRecording;
    setIsRecording(recording);
    setResponse(null);

    if (recording) {
        setTranscribedText('');
        // Mock transcription appearing after a delay
        setTimeout(() => {
            setTranscribedText('क्या घाट बंद हैं?');
        }, 2500);
    }
  }

  const handleSubmit = () => {
    // Mock AI response
    setResponse({
        text: 'The ghat roads are currently open. There are no weather alerts. Drive safely.',
        audio: null
    })
    setIsRecording(false);
  }

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            aria-label="Open Voice Assistant"
            className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg animate-pulse"
            size="icon"
          >
            <Mic className="h-8 w-8" />
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[85vh] rounded-t-lg flex flex-col">
          <SheetHeader className="text-center">
            <SheetTitle className="font-headline text-3xl">Voice Assistant</SheetTitle>
            <SheetDescription>
              Ask a question in English or Hindi. Try "Nearest hotels?" or "What to pack?".
            </SheetDescription>
          </SheetHeader>
          <div className="py-4 space-y-4 flex-grow overflow-y-auto">
              {isRecording && <Waveform />}
              {transcribedText && (
                  <div className="space-y-2">
                      <label className="text-sm font-medium">Your question:</label>
                      <Textarea value={transcribedText} onChange={(e) => setTranscribedText(e.target.value)} rows={2} />
                  </div>
              )}
              {response && (
                  <div className="p-4 bg-muted rounded-lg space-y-2 animate-in fade-in-50">
                      <h3 className="font-semibold font-headline">Answer:</h3>
                      <p>{response.text}</p>
                      {/* TTS Play button would go here */}
                  </div>
              )}
          </div>
            
          <SheetFooter className="mt-auto items-center pt-4 border-t">
              <div className="flex w-full justify-center items-center gap-4">
                <Button onClick={handleRecordToggle} variant={isRecording ? 'destructive' : 'default'} size="lg" className="rounded-full w-20 h-20 flex items-center justify-center">
                    {isRecording ? (
                        <div className="w-6 h-6 bg-white rounded-sm" />
                    ) : (
                        <Mic className="h-8 w-8" />
                    )}
                </Button>
                {transcribedText && !isRecording && !response && (
                    <Button onClick={handleSubmit} size="lg">Get Answer</Button>
                )}
              </div>
            </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  )
}

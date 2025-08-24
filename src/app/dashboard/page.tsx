
'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Calendar, CloudRain, Download, HeartPulse, Hotel, ListChecks, Loader2, Map, Phone, Route, ShieldAlert, ShieldCheck } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { generateItinerary, GenerateItineraryInput, GenerateItineraryOutput } from "@/ai/flows/generate-itinerary";
import { useToast } from "@/hooks/use-toast";

function DashboardContent() {
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const from = searchParams.get('from');
    const departure = searchParams.get('departure');
    const groupSize = searchParams.get('groupSize');

    const [itinerary, setItinerary] = useState<GenerateItineraryOutput | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);


    const handleGenerateItinerary = async () => {
        setIsGenerating(true);
        setItinerary(null);
        try {
            if (!from || !departure || !groupSize) {
                toast({
                    variant: "destructive",
                    title: "Missing Information",
                    description: "Please go back to the home page and plan your trip first.",
                });
                return;
            }

            const input: GenerateItineraryInput = {
                from: from,
                arrive_datetime: departure,
                group_size: parseInt(groupSize),
                hotel: null, // Placeholder
                language: 'English', // Placeholder
                weather_alerts: 'Roads are clear and weather is favorable.', // Placeholder
            };

            const result = await generateItinerary(input);
            setItinerary(result);
        } catch (error) {
            console.error(error);
            toast({
                variant: "destructive",
                title: "Error Generating Itinerary",
                description: "There was a problem creating your itinerary. Please try again.",
            })
        } finally {
            setIsGenerating(false);
        }
    }
    
    return (
        <div className="container py-8 md:py-12">
            <div className="mb-8">
                <h1 className="font-headline text-4xl font-bold">Your Yatra Dashboard</h1>
                <p className="text-muted-foreground">Trip from <span className="text-primary font-semibold">{from || 'your location'}</span> to Srisailam.</p>
            </div>

            <div className="grid gap-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                    <Card className="flex flex-col">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 font-headline"><ShieldAlert className="text-primary"/>Safety Panel</CardTitle>
                            <CardDescription>Road & Monsoon Alerts</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <Alert variant="default" className="bg-green-100/50 border-green-300">
                                <ShieldCheck className="h-4 w-4 text-green-600" />
                                <AlertTitle className="text-green-800">All Clear!</AlertTitle>
                                <AlertDescription className="text-green-700">
                                    Roads are clear and weather is favorable. Last updated: 5 mins ago.
                                </AlertDescription>
                            </Alert>
                            <div className="mt-4 flex gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1"><CloudRain size={16}/> 24°C, Clear</div>
                                <div className="flex items-center gap-1"><Route size={16}/> Ghats Open</div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline">View Detailed Alerts</Button>
                        </CardFooter>
                    </Card>

                    <Card className="flex flex-col">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 font-headline"><ListChecks className="text-primary"/>AI Itinerary</CardTitle>
                            <CardDescription>Personalized 3-Day Plan</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p className="text-muted-foreground">Generate a custom itinerary including a packing checklist, darshan timings, and more, all tailored to your trip.</p>
                        </CardContent>
                        <CardFooter className="flex gap-2">
                            <Button onClick={handleGenerateItinerary} disabled={isGenerating}>
                                {isGenerating ? <Loader2 className="mr-2 animate-spin"/> : null}
                                {isGenerating ? 'Generating...' : itinerary ? 'Regenerate Itinerary' : 'Generate Itinerary'}
                            </Button>
                            <Button variant="outline" disabled={!itinerary}><Download className="mr-2 h-4 w-4"/>Download PDF</Button>
                        </CardFooter>
                    </Card>

                    <Card className="flex flex-col">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 font-headline"><Map className="text-primary"/>Emergency & Offline Kit</CardTitle>
                            <CardDescription>Maps, Contacts, and Medical Info</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p className="text-muted-foreground">Download an offline map and a list of emergency contacts, hospitals, and pharmacies for your peace of mind.</p>
                            <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1"><HeartPulse size={16}/>Hospitals</div>
                                <div className="flex items-center gap-1"><Phone size={16}/>Contacts</div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline"><Download className="mr-2 h-4 w-4"/>Download Kit</Button>
                        </CardFooter>
                    </Card>

                    <Card className="flex flex-col">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 font-headline"><Hotel className="text-primary"/>Accommodation Finder</CardTitle>
                            <CardDescription>Find hotels near your location</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p className="text-muted-foreground">Discover hotels sorted by distance and travel time. Links to book on external sites.</p>
                        </CardContent>
                        <CardFooter className="flex flex-col sm:flex-row gap-2 w-full">
                            <Button className="w-full sm:w-auto">Find Nearest Hotels</Button>
                            <Button variant="outline" className="w-full sm:w-auto">Upload Booking Proof</Button>
                        </CardFooter>
                    </Card>
                </div>

                {isGenerating && (
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-center gap-4">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                <p className="text-muted-foreground">Generating your personalized itinerary...</p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {itinerary && (
                    <Card className="animate-in fade-in-50">
                        <CardHeader>
                            <CardTitle className="font-headline">Your Srisailam Itinerary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <h3 className="font-semibold text-lg flex items-center gap-2"><Map className="text-primary" /> Itinerary</h3>
                                <p className="text-muted-foreground whitespace-pre-wrap">{itinerary.itinerary}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg flex items-center gap-2"><ListChecks className="text-primary" /> Packing Checklist</h3>
                                <ul className="list-disc pl-5 text-muted-foreground whitespace-pre-wrap">
                                    {itinerary.packing_checklist.split('\n').filter(Boolean).map((item, index) => <li key={index}>{item.replace(/^- /, '')}</li>)}
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg flex items-center gap-2"><Calendar className="text-primary" /> Calendar Events</h3>
                                <p className="text-muted-foreground text-sm">You can add these events to your calendar.</p>
                                <pre className="text-xs bg-muted p-2 rounded-md mt-2 overflow-x-auto"><code>{itinerary.calendar_events}</code></pre>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg flex items-center gap-2"><ShieldAlert className="text-primary" /> Safety Note</h3>
                                <p className="text-muted-foreground">{itinerary.safety_note}</p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}


export default function DashboardPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DashboardContent />
        </Suspense>
    )
}

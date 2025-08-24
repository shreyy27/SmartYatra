
'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink, Hotel, ListChecks, Loader2, Map } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { generateItinerary, GenerateItineraryInput, GenerateItineraryOutput } from "@/ai/flows/generate-itinerary";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"


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
                setIsGenerating(false);
                return;
            }

            const input: GenerateItineraryInput = {
                from: from,
                arrive_datetime: departure,
                group_size: parseInt(groupSize),
                hotel: null, // Placeholder
                language: 'English', // Placeholder
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
                    <Card className="flex flex-col md:col-span-2">
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
                            <CardTitle className="flex items-center gap-2 font-headline"><Hotel className="text-primary"/>Accommodation</CardTitle>
                            <CardDescription>Book official Devasthanam lodging</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p className="text-muted-foreground">Book your stay at official Srisailam Devasthanam accommodations directly through their portal for a convenient and authentic experience.</p>
                        </CardContent>
                        <CardFooter>
                            <Link href="https://www.srisailadevasthanam.org/en-in/devotee-app/online-booking/accommodations" target="_blank" rel="noopener noreferrer">
                                <Button>
                                    Book Official Accommodation
                                    <ExternalLink className="ml-2 h-4 w-4"/>
                                </Button>
                            </Link>
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
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Day</TableHead>
                                            <TableHead>Time</TableHead>
                                            <TableHead>Activity</TableHead>
                                            <TableHead>Description</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {itinerary.itinerary.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell className="font-medium">{item.day}</TableCell>
                                                <TableCell>{item.time}</TableCell>
                                                <TableCell>{item.activity}</TableCell>
                                                <TableCell>{item.description}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg flex items-center gap-2"><ListChecks className="text-primary" /> Packing Checklist</h3>
                                <p className="text-muted-foreground whitespace-pre-wrap">{itinerary.packing_checklist}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg flex items-center gap-2"><ListChecks className="text-primary" /> Safety Note</h3>
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

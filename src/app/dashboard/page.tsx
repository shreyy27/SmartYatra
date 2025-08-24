
'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Calendar, Cloud, CloudRain, Download, HeartPulse, Hotel, ListChecks, Loader2, Map, Phone, Route, ShieldAlert, ShieldCheck, Waves } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { generateItinerary, GenerateItineraryInput, GenerateItineraryOutput } from "@/ai/flows/generate-itinerary";
import { getSafetyAlerts, GetSafetyAlertsOutput } from "@/ai/flows/get-safety-alerts";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

function DashboardContent() {
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const from = searchParams.get('from');
    const destination = searchParams.get('destination') || 'Srisailam';
    const departure = searchParams.get('departure');
    const groupSize = searchParams.get('groupSize');

    const [itinerary, setItinerary] = useState<GenerateItineraryOutput | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [safetyAlerts, setSafetyAlerts] = useState<GetSafetyAlertsOutput | null>(null);
    const [isLoadingAlerts, setIsLoadingAlerts] = useState(true);

    const fetchSafetyAlerts = useCallback(async () => {
        setIsLoadingAlerts(true);
        try {
            const alerts = await getSafetyAlerts({ location: destination });
            setSafetyAlerts(alerts);
        } catch (error) {
            console.error(error);
            toast({
                variant: "destructive",
                title: "Could not fetch safety alerts.",
                description: "There was a problem getting the latest safety information.",
            });
            // Set a default fallback alert
            setSafetyAlerts({
                status: "Warning",
                summary: "Could not retrieve live data. Please proceed with caution.",
                temperature: 0,
                weatherCondition: "Unknown",
                isGhatOpen: true,
            });
        } finally {
            setIsLoadingAlerts(false);
        }
    }, [destination, toast]);

    useEffect(() => {
        fetchSafetyAlerts();
    }, [fetchSafetyAlerts]);


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
                weather_alerts: safetyAlerts ? safetyAlerts.summary : 'Weather data not available.',
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

    const getAlertCardProps = () => {
        if (!safetyAlerts || isLoadingAlerts) {
            return {
                variant: "default",
                icon: <ShieldAlert className="h-4 w-4" />,
                title: "Fetching Alerts...",
                description: "Getting the latest safety information...",
                className: "bg-gray-100/50 border-gray-300",
                titleClassName: "text-gray-800",
                descriptionClassName: "text-gray-700",
            };
        }

        switch (safetyAlerts.status) {
            case 'All Clear':
                return {
                    variant: "default",
                    icon: <ShieldCheck className="h-4 w-4 text-green-600" />,
                    title: "All Clear!",
                    description: safetyAlerts.summary,
                    className: "bg-green-100/50 border-green-300",
                    titleClassName: "text-green-800",
                    descriptionClassName: "text-green-700",
                };
            case 'Warning':
                return {
                    variant: "default",
                    icon: <ShieldAlert className="h-4 w-4 text-yellow-600" />,
                    title: "Warning",
                    description: safetyAlerts.summary,
                    className: "bg-yellow-100/50 border-yellow-300",
                    titleClassName: "text-yellow-800",
                    descriptionClassName: "text-yellow-700",
                };
            case 'Danger':
                return {
                    variant: "destructive",
                    icon: <ShieldAlert className="h-4 w-4 text-red-600" />,
                    title: "Danger",
                    description: safetyAlerts.summary,
                    className: "bg-red-100/50 border-red-300",
                    titleClassName: "text-red-800",
                    descriptionClassName: "text-red-700",
                };
            default:
                 return {
                    variant: "default" as const,
                    icon: <ShieldAlert className="h-4 w-4" />,
                    title: "Status Unknown",
                    description: "Could not determine safety status.",
                    className: "bg-gray-100/50 border-gray-300",
                    titleClassName: "text-gray-800",
                    descriptionClassName: "text-gray-700",
                };
        }
    };

    const alertProps = getAlertCardProps();
    
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
                            {isLoadingAlerts ? (
                                <div className="space-y-2">
                                    <Skeleton className="h-10 w-full" />
                                    <Skeleton className="h-6 w-3/4" />
                                </div>
                            ) : (
                                <Alert variant={alertProps.variant as any} className={alertProps.className}>
                                    {alertProps.icon}
                                    <AlertTitle className={alertProps.titleClassName}>{alertProps.title}</AlertTitle>
                                    <AlertDescription className={alertProps.descriptionClassName}>
                                        {alertProps.description}
                                    </AlertDescription>
                                </Alert>
                            )}
                            <div className="mt-4 flex gap-4 text-sm text-muted-foreground">
                                {isLoadingAlerts ? (
                                    <>
                                        <Skeleton className="h-5 w-20" />
                                        <Skeleton className="h-5 w-24" />
                                    </>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-1"><Cloud size={16}/> {safetyAlerts?.temperature}°C, {safetyAlerts?.weatherCondition}</div>
                                        <div className="flex items-center gap-1"><Route size={16}/> Ghats {safetyAlerts?.isGhatOpen ? 'Open' : 'Closed'}</div>
                                    </>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" onClick={fetchSafetyAlerts} disabled={isLoadingAlerts}>
                                {isLoadingAlerts ? <Loader2 className="mr-2 animate-spin"/> : null}
                                Refresh
                            </Button>
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
                            <Button onClick={handleGenerateItinerary} disabled={isGenerating || isLoadingAlerts}>
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
                            <p className="text-muted-foreground">Access essential emergency contacts, hospital locations, and instructions for downloading an offline map for peace of mind.</p>
                            <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1"><HeartPulse size={16}/>Hospitals</div>
                                <div className="flex items-center gap-1"><Phone size={16}/>Contacts</div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Link href="/emergency" passHref>
                                <Button variant="outline"><Download className="mr-2 h-4 w-4"/>View Emergency Kit</Button>
                            </Link>
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
                                <p className="text-muted-foreground whitespace-pre-wrap">{itinerary.packing_checklist}</p>
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

'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CloudRain, Download, HeartPulse, Hotel, ListChecks, Map, Phone, Route, ShieldAlert, ShieldCheck } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function DashboardContent() {
    const searchParams = useSearchParams();
    const from = searchParams.get('from');
    
    return (
        <div className="container py-8 md:py-12">
            <div className="mb-8">
                <h1 className="font-headline text-4xl font-bold">Your Yatra Dashboard</h1>
                <p className="text-muted-foreground">Trip from <span className="text-primary font-semibold">{from || 'your location'}</span> to Srisailam.</p>
            </div>

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
                        <Button>Generate Itinerary</Button>
                        <Button variant="outline"><Download className="mr-2 h-4 w-4"/>Download PDF</Button>
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

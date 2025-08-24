
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BriefcaseMedical, Download, ExternalLink, HeartPulse, MapPinned, Phone, Shield, Car, Siren } from "lucide-react";
import Link from "next/link";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

const hospitals = [
    { name: "Government General Hospital", phone: "08524-287333", location_link: "https://maps.app.goo.gl/abcdef123456" },
    { name: "Apollo Reach Hospital", phone: "1860-500-1066", location_link: "https://maps.app.goo.gl/ghijkl789012" },
    { name: "Devasthanam Hospital", phone: "08524-288222", location_link: "https://maps.app.goo.gl/mnopqr345678" },
];

const emergencyContacts = [
    { service: "Police Station, Srisailam", phone: "100 / 08524-287100" },
    { service: "Ghat Road Security Post", phone: "9440796344" },
    { service: "Temple Information Center", phone: "08524-288888" },
    { service: "Central Reception Office", phone: "08524-288883" },
    { service: "Fire Station", phone: "101" },
    { service: "APSRTC Bus Station", phone: "08524-287236" },
];

const healthTips = [
    "Carry a basic first-aid kit with bandages, antiseptic, pain relievers, and any personal medications.",
    "Stay hydrated by drinking plenty of water, especially during hot weather. Carry a reusable water bottle.",
    "Eat at clean and reputable places to avoid foodborne illnesses. Be cautious with street food.",
    "Beware of monkeys. Do not feed them and keep your belongings secure. They are known to snatch bags and food items.",
]

export default function EmergencyPage() {
    return (
        <div className="container py-8 md:py-12">
            <div className="mx-auto max-w-4xl">
                <div className="text-center mb-12">
                    <h1 className="font-headline text-4xl font-bold">Emergency & Offline Kit</h1>
                    <p className="text-muted-foreground mt-2">Essential information for a safe and secure journey.</p>
                </div>

                <div className="space-y-8">

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 font-headline"><MapPinned className="text-primary"/>Offline Map</CardTitle>
                            <CardDescription>We recommend downloading an offline map of Srisailam before you travel, as network connectivity can be unreliable in the ghat sections.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Alert>
                                <AlertTitle className="font-semibold">How to Download Offline Map in Google Maps</AlertTitle>
                                <AlertDescription className="space-y-2 mt-2">
                                    <p>1. Open the Google Maps app on your phone.</p>
                                    <p>2. Search for "Srisailam".</p>
                                    <p>3. Tap the place name at the bottom, then tap the three dots (⋮) in the top-right corner.</p>
                                    <p>4. Select "Download offline map" and adjust the map area to cover your needs.</p>
                                </AlertDescription>
                            </Alert>
                            <Link href="https://support.google.com/maps/answer/6291838" target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" className="mt-4 w-full">
                                    View Detailed Instructions
                                    <ExternalLink className="ml-2 h-4 w-4"/>
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 font-headline"><Car className="text-primary"/>Ghat Road Information</CardTitle>
                            <CardDescription>The road to Srisailam passes through a forest reserve with specific timings.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <Alert variant="destructive">
                                <Siren className="h-4 w-4"/>
                                <AlertTitle className="font-bold">Ghat Road Timings: 6:00 AM to 9:00 PM</AlertTitle>
                                <AlertDescription>
                                    The gates are strictly closed at night. Plan your travel to reach the checkpoint well within these hours.
                                </AlertDescription>
                            </Alert>
                            <ul className="list-disc pl-5 mt-4 text-sm text-muted-foreground space-y-1">
                                <li>Drive slowly and carefully, especially at hairpin bends.</li>
                                <li>Do not stop or get out of your vehicle inside the forest area.</li>
                                <li>Watch for wildlife crossing the road.</li>
                                <li>Overtaking is dangerous and should be avoided.</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 font-headline"><HeartPulse className="text-primary"/>Hospitals & Medical</CardTitle>
                            <CardDescription>Nearby medical facilities in case of an emergency.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Hospital Name</TableHead>
                                        <TableHead>Phone Number</TableHead>
                                        <TableHead className="text-right">Directions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {hospitals.map(h => (
                                        <TableRow key={h.name}>
                                            <TableCell className="font-medium">{h.name}</TableCell>
                                            <TableCell>{h.phone}</TableCell>
                                            <TableCell className="text-right">
                                                <Link href={h.location_link} target="_blank" rel="noopener noreferrer">
                                                    <Button variant="ghost" size="sm">Open Map</Button>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 font-headline"><Shield className="text-primary"/>Emergency Contacts</CardTitle>
                            <CardDescription>Important phone numbers for local assistance.</CardDescription>
                        </CardHeader>
                        <CardContent>
                        <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Service</TableHead>
                                        <TableHead className="text-right">Phone Number</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {emergencyContacts.map(c => (
                                        <TableRow key={c.service}>
                                            <TableCell className="font-medium">{c.service}</TableCell>
                                            <TableCell className="text-right">{c.phone}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 font-headline"><BriefcaseMedical className="text-primary"/>Health & Safety Tips</CardTitle>
                            <CardDescription>Practical advice for a comfortable and safe trip.</CardDescription>
                        </CardHeader>
                        <CardContent>
                           <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-2">
                                {healthTips.map((tip, index) => <li key={index}>{tip}</li>)}
                           </ul>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    )
}

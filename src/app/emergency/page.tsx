
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Download, ExternalLink, HeartPulse, MapPinned, Phone, Shield } from "lucide-react";
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
    { service: "Police Station, Srisailam", phone: "08524-287100" },
    { service: "Ghat Road Security", phone: "9440796344" },
    { service: "Temple Information Center", phone: "08524-288888" },
    { service: "Fire Station", phone: "101" },
];


export default function EmergencyPage() {
    return (
        <div className="container py-8 md:py-12">
            <div className="mx-auto max-w-4xl">
                <div className="text-center mb-12">
                    <h1 className="font-headline text-4xl font-bold">Emergency & Offline Kit</h1>
                    <p className="text-muted-foreground mt-2">Essential information for a safe and secure journey.</p>
                </div>

                <Card className="mb-8">
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

                <Card className="mb-8">
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
                        <CardDescription>Important phone numbers for assistance.</CardDescription>
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

            </div>
        </div>
    )
}

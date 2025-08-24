
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"
import Link from "next/link"
  
  export default function DarshanPage() {
    const darshanInfo = [
        {
            id: "darshan-types",
            question: "What are the different types of darshan available?",
            answer: "Srisailam temple offers several types of darshan. The main ones are: Sarva Darshan (free entry for all), Seeghra Darshan (a paid option for a quicker darshan), and Sparsha Darshan (which allows devotees to touch the main Jyotirlingam, available only during specific, limited hours). It is highly recommended to check the official Devasthanam website for the most current timings and availability before your visit.",
        },
        {
            id: "dress-code",
            question: "Is there a mandatory dress code for the temple?",
            answer: "Yes, a strict traditional dress code is enforced. Men are required to wear a Dhoti or Lungi (with an upper cloth) or Kurta-Pajama. Women must wear a Saree, Salwar Kameez with a Chunni, or a traditional half-saree. Western attire such as jeans, shorts, t-shirts, and skirts are not permitted inside the temple premises.",
        },
        {
            id: "id-proof",
            question: "What form of ID is required for darshan and other services?",
            answer: "An original government-issued photo ID is mandatory for all devotees, especially for Sparsha Darshan and accommodation booking. The Aadhaar card is the most widely accepted form of identification. Ensure you carry the physical original card, as digital copies or photocopies may not be accepted.",
        },
        {
            id: "mobile-policy",
            question: "Are mobile phones and cameras allowed inside the temple?",
            answer: "No, mobile phones, cameras, and other electronic gadgets are strictly prohibited inside the main temple complex. You must deposit them at the designated counters available near the temple entrance before you proceed for darshan. It's advisable to leave non-essential electronics at your accommodation.",
        },
        {
            id: "temple-timings",
            question: "What are the general temple opening and closing times?",
            answer: "The temple is generally open from 4:30 AM to 10:00 PM. However, darshan timings, poojas, and rituals have specific schedules throughout the day. These timings can also change during festivals and special occasions. Please check the official website for the daily schedule.",
        },
        {
            id: "history",
            question: "What is the history and significance of the temple?",
            answer: "Sri Mallikarjuna Swamy Temple, located at Srisailam, is one of the twelve Jyotirlingas of Lord Shiva and also one of the eighteen Shakti Peethas of Goddess Parvati. The presiding deities are Mallikarjuna Swamy (a form of Shiva) and Bhramaramba Devi (a form of Parvati), making it a unique site revered by both Shaivites and Shaktas.",
      },
    ];
  
    return (
      <div className="container py-8 md:py-12">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="font-headline text-4xl font-bold">Darshan Information</h1>
            <p className="text-muted-foreground mt-2">Essential guidelines for your visit to Mallikarjuna Temple.</p>
          </div>
  
          <Card className="mb-8">
            <CardHeader>
                <CardTitle className="font-headline">Official Darshan Booking</CardTitle>
                <CardDescription>The "Book Darshan" button will take you to the official Srisaila Devasthanam booking page in a new tab for all online services.</CardDescription>
            </CardHeader>
            <CardContent>
                <Link href="https://www.srisailadevasthanam.org/en-in/online-booking" target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="w-full">
                        Book Darshan (Official Site)
                        <ExternalLink className="ml-2 h-4 w-4"/>
                    </Button>
                </Link>
            </CardContent>
          </Card>


          <h2 className="font-headline text-2xl font-bold mb-4">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            {darshanInfo.map((item) => (
              <AccordionItem value={item.id} key={item.id}>
                <AccordionTrigger className="text-lg text-left">{item.question}</AccordionTrigger>

                <AccordionContent className="text-base text-muted-foreground leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    )
  }
  

    
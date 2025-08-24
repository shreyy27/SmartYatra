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
        id: "history",
        question: "What is the history of the temple?",
        answer: "Sri Mallikarjuna Swamy Temple, located at Srisailam is one of the twelve Jyotirlingas of Lord Shiva. The presiding deities are Mallikarjuna Swamy (a form of Shiva) and Bhramaramba Devi (a form of Parvati). The temple is significant to the Hindu sects of both Shaivism and Shaktism as this temple is referred to as one of the eighteen Shakti Peethas.",
      },
      {
        id: "darshan-types",
        question: "What are the different types of darshan?",
        answer: "The main types of darshan are Sarva Darshan (free for all), Seeghra Darshan (express darshan for a fee), and Sparsha Darshan (allows devotees to touch the Jyotirlingam). Timings and availability vary, so it's best to check the official website.",
      },
      {
        id: "dress-code",
        question: "Is there a dress code?",
        answer: "Yes, a traditional dress code is strictly enforced. Men should wear dhoti or kurta-pajama. Women should wear a saree or a salwar kameez with a chunni. Western wear like jeans, t-shirts, and shorts are not permitted inside the temple premises.",
      },
      {
        id: "id-proof",
        question: "What ID is required for darshan?",
        answer: "An original government-issued photo ID is mandatory for all devotees. Aadhaar card is the most commonly accepted ID. Please carry the original card, as photocopies or digital versions may not be accepted for certain darshans or services.",
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
                <CardDescription>The "Book Darshan" button will take you to the official Srisaila Devasthanam booking page in a new tab.</CardDescription>
            </CardHeader>
            <CardContent>
                <Link href="https://www.srisailadevasthanam.org/en-in/e-services/e-darshanam" target="_blank" rel="noopener noreferrer">
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
                <AccordionTrigger className="text-lg">{item.question}</AccordionTrigger>
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
  
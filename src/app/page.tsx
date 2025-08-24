import { TripPlanner } from "@/components/trip-planner";

export default function Home() {
  return (
    <div className="container relative">
      <section className="mx-auto flex max-w-[980px] flex-col items-center gap-2 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-20">
        <h1 className="text-center text-3xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1] font-headline text-balance">
          Your Personal Yatra Assistant
        </h1>
        <p className="max-w-[750px] text-center text-lg text-muted-foreground sm:text-xl text-balance">
          Plan your sacred journey to Mallikarjuna Jyotirlinga with AI-powered itineraries, safety alerts, and offline support.
        </p>
      </section>
      <section className="mx-auto max-w-4xl py-8">
        <TripPlanner />
      </section>
    </div>
  );
}

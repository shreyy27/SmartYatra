
'use client'

import { Button } from "@/components/ui/button";
import { TripPlanner } from "@/components/trip-planner";
import { Languages } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function WelcomeAnimation() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 4500); // Keep it on screen a bit longer

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
            className="text-center p-8 rounded-lg shadow-2xl bg-card"
          >
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="font-headline text-4xl md:text-5xl text-primary mb-2"
            >
              Namaste, Pandeyji! 🙏
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.7 }}
              className="font-body text-lg md:text-xl text-muted-foreground"
            >
              Aapki Srisailam yatra mangalmay ho. 🕉️
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


export default function Home() {
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

  return (
    <>
    {isClient && <WelcomeAnimation />}
    <div className="container relative">
      <div className="absolute top-4 right-4 z-10">
        <Link href="/translate">
          <Button>
            <Languages className="mr-2 h-5 w-5" />
            Translate
          </Button>
        </Link>
      </div>
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
    </>
  );
}

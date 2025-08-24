'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { CalendarIcon, Loader2, LocateFixed, MapPin } from "lucide-react"
import { Calendar } from "./ui/calendar"
import { cn } from "@/lib/utils"
import { useState, useEffect, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

const formSchema = z.object({
  from_location_type: z.enum(["gps", "address"]),
  from_location: z.string().min(2, { message: "Please enter a valid location." }),
  destination: z.string(),
  departure_date: z.date({
    required_error: "Departure date is required.",
  }),
  arrival_time: z.string({
    required_error: "Arrival time is required.",
  }),
  return_date: z.date({
    required_error: "Return date is required.",
  }),
  group_size: z.coerce.number().min(1, { message: "Group must have at least one person." }),
})

export function TripPlanner() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLocating, setIsLocating] = useState(false)
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      from_location_type: "address",
      from_location: "",
      destination: "Srisailam / Mallikarjuna Jyotirlinga",
      group_size: 1,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setShowSuggestions(false);
    const arrival_datetime = new Date(values.departure_date);
    const [hours, minutes] = values.arrival_time.split(':');
    arrival_datetime.setHours(parseInt(hours), parseInt(minutes));

    const params = new URLSearchParams({
        from: values.from_location,
        destination: values.destination,
        departure: arrival_datetime.toISOString(),
        return: values.return_date.toISOString(),
        groupSize: values.group_size.toString(),
    });
    router.push(`/dashboard?${params.toString()}`);
  }

  const handleUseCurrentLocation = () => {
    setIsLocating(true)
    setShowSuggestions(false);
    if (!navigator.geolocation) {
      toast({
        variant: "destructive",
        title: "Geolocation not supported",
        description: "Your browser does not support geolocation.",
      })
      setIsLocating(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        form.setValue("from_location", `${latitude}, ${longitude}`)
        setIsLocating(false)
        toast({
          title: "Location Found!",
          description: "Your current location has been set as the starting point.",
        })
      },
      () => {
        toast({
          variant: "destructive",
          title: "Unable to retrieve location",
          description: "Please ensure location services are enabled.",
        })
        setIsLocating(false)
      }
    )
  }

  const fetchSuggestions = useCallback(async (query: string) => {
    if (query.length < 3) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
    }
    const apiKey = process.env.NEXT_PUBLIC_MAPPLS_API_KEY;
    if (!apiKey) {
      console.error("Mappls API key not configured.");
      // Silently fail, or show a toast. For now, silent.
      return;
    }
    
    try {
        const response = await fetch(`https://atlas.mappls.com/api/places/search/json?query=${query}&pod=city`, {
            headers: {
              'Authorization': `bearer ${apiKey}`,
              'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        setSuggestions(data.suggestedLocations || []);
        setShowSuggestions(true);
    } catch (error) {
        console.error("Error fetching Mappls suggestions:", error);
        setShowSuggestions(false);
    }
  }, []);

  const handleSuggestionClick = (suggestion: any) => {
      form.setValue("from_location", suggestion.placeName);
      setSuggestions([]);
      setShowSuggestions(false);
  }

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'from_location' && form.getValues('from_location_type') === 'address') {
        fetchSuggestions(value.from_location || '');
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch, fetchSuggestions]);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Plan Your Yatra</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="from_location_type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Starting Location</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.setValue("from_location", "");
                        setShowSuggestions(false);
                      }}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="address" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Type an address/city
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="gps" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Use my current location
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="from_location"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input 
                        placeholder="e.g. Pune, Hyderabad..." 
                        {...field} 
                        className="pl-10" 
                        disabled={form.watch('from_location_type') === 'gps'}
                        autoComplete="off"
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                        onFocus={(e) => fetchSuggestions(e.target.value)}
                      />
                      {form.watch('from_location_type') === 'gps' &&
                        <Button type="button" size="sm" onClick={handleUseCurrentLocation} className="absolute right-1 top-1/2 -translate-y-1/2 h-8" disabled={isLocating}>
                          {isLocating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LocateFixed className="mr-2 h-4 w-4" />}
                          Locate
                        </Button>
                      }
                      {showSuggestions && suggestions.length > 0 && form.watch('from_location_type') === 'address' && (
                          <div className="absolute z-10 w-full bg-card border rounded-md mt-1 shadow-lg">
                              {suggestions.map((suggestion) => (
                                  <div
                                      key={suggestion.eLoc}
                                      className="p-2 hover:bg-accent cursor-pointer"
                                      onClick={() => handleSuggestionClick(suggestion)}
                                  >
                                      {suggestion.placeName}
                                  </div>
                              ))}
                          </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="destination"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Destination</FormLabel>
                  <FormControl>
                    <Input {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="departure_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Arrival Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0,0,0,0))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="arrival_time"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Arrival Time</FormLabel>
                     <FormControl>
                        <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="return_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Return Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < (form.getValues("departure_date") || new Date())
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="group_size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group Size</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full" size="lg">Plan Yatra</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

    
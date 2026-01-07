import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Calendar, MapPin, Users } from "lucide-react"

interface EventCardProps {
  title: string
  date: string
  location: string
  attendees: number
  price: string
  image: string
  type?: "event" | "sport"
}

export function EventCard({ title, date, location, attendees, price, image, type = "event" }: EventCardProps) {
  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/10">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-4 right-4">
          <span className="rounded-full bg-background/90 px-3 py-1 text-sm font-bold backdrop-blur">{price}</span>
        </div>
      </div>
      <CardContent className="p-6">
        <h3 className="font-bold text-xl mb-3 text-balance">{title}</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {date}
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {location}
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {attendees.toLocaleString()} attendees
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button className="w-full" variant={type === "sport" ? "default" : "default"}>
          Book Now
        </Button>
      </CardFooter>
    </Card>
  )
}

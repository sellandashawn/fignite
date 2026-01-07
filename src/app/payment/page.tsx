"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle, Calendar, MapPin, Download, Share2, User, Clock, Trophy, Users } from "lucide-react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { registerParticipantWithPayment } from '../api/participant'
import { Footer } from "@/components/footer";

interface AttendeeInfo {
  name: string
  idNumber: string
  age: string
  gender: string
  email: string
  teamName: string
}

interface RegistrationData {
  id: string
  sportId: string
  eventId: string
  sportName: string
  eventName: string
  quantity: number
  totalAmount: number
  status: string
  billingInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  attendeeInfo: AttendeeInfo[]
  paymentInfo: {
    subtotal: number
    total: number
    status: string
  }
  createdAt: string
  sportDate: string
  sportVenue: string
  sportTime: string
  sportImage: string
  eventDate: string
  eventvenue: string
  eventtime: string
  eventimage: string
  perTicketPrice: number
  teamName: string
}

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isClient, setIsClient] = useState(false)
  const [registrationData, setRegistrationData] = useState<RegistrationData | null>(null)
  const [isProcessing, setIsProcessing] = useState(true)
  const [registrationResult, setRegistrationResult] = useState<any>(null)
  const hasProcessed = useRef(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient || hasProcessed.current) return

    hasProcessed.current = true
    processRegistration()
  }, [isClient])

  const processRegistration = async () => {
    try {
      const storedRegistration = localStorage.getItem('currentRegistration')

      if (!storedRegistration) {
        console.error('No registration data found in localStorage')
        setIsProcessing(false)
        return
      }

      const registration: RegistrationData = JSON.parse(storedRegistration)
      setRegistrationData(registration)
      console.log("Registration data:", registration)

      const isSport = !!registration.sportId || !!registration.sportName
      const entityId = registration.sportId || registration.eventId
      const entityName = registration.sportName || registration.eventName

      if (!entityId) {
        console.error('No sport or event ID found in registration')
        setIsProcessing(false)
        return
      }

      const participantData = {
        orderId: registration.id,
        billingFirstName: registration.billingInfo.firstName || '',
        billingLastName: registration.billingInfo.lastName || '',
        billingEmail: registration.billingInfo.email || '',
        billingPhone: registration.billingInfo.phone || '',
        attendees: registration.attendeeInfo.map(attendee => ({
          name: attendee.name || '',
          idNumber: attendee.idNumber || '',
          age: attendee.age || '',
          gender: attendee.gender || '',
          attendeeEmail: attendee.email || '',
          teamName: attendee.teamName || registration.teamName || '',
        })),
        teamName: registration.attendeeInfo[0]?.teamName || registration.teamName || '',
        amount: registration.totalAmount,
        numberOfTickets: registration.quantity,
        paymentDate: new Date().toISOString(),
        isSport: isSport,
        sportId: registration.sportId,
        eventId: registration.eventId
      }

      console.log('Participant Data:', participantData)

      const result = await registerParticipantWithPayment(entityId, participantData, isSport)
      setRegistrationResult(result)

      console.log('Registration successful:', result)

      localStorage.removeItem('currentRegistration')

      sessionStorage.removeItem('stripe_checkout_data')

    } catch (error) {
      console.error('Error processing registration:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  if (!isClient || isProcessing) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            {isProcessing ? "Completing your registration..." : "Loading..."}
          </p>
        </div>
      </div>
    )
  }

  if (!registrationData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <CheckCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Registration Not Found</h1>
          <p className="text-muted-foreground mb-4">
            Unable to find your registration details.
          </p>
          <Button asChild>
            <Link href="/sports">Browse Sports</Link>
          </Button>
        </div>
      </div>
    )
  }

  const isSport = !!registrationData.sportId || !!registrationData.sportName
  const entityName = registrationData.sportName || registrationData.eventName || "Registration"
  const entityDate = registrationData.sportDate || registrationData.eventDate
  const entityVenue = registrationData.sportVenue || registrationData.eventvenue
  const entityTime = registrationData.sportTime || registrationData.eventtime
  const entityImage = registrationData.sportImage || registrationData.eventimage

  const orderSummary = {
    orderId: registrationData.id,
    entity: {
      title: entityName,
      type: isSport ? "Sport" : "Event",
      date: entityDate ? new Date(entityDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) : "Date not specified",
      time: entityTime || "Time not specified",
      location: entityVenue || "Location not specified",
      image: entityImage,
      perTicketPrice: registrationData.perTicketPrice || 0
    },
    tickets: [
      {
        id: 1,
        type: isSport ? "Sport Participation" : "General Admission",
        quantity: registrationData.quantity,
        price: registrationData.perTicketPrice || (registrationData.paymentInfo.subtotal / registrationData.quantity),
        subtotal: registrationData.paymentInfo.subtotal
      }
    ],
    billingInfo: {
      name: `${registrationData.billingInfo.firstName} ${registrationData.billingInfo.lastName}`,
      email: registrationData.billingInfo.email,
      phone: registrationData.billingInfo.phone
    },
    attendees: registrationData.attendeeInfo,
    teamName: registrationData.teamName || registrationData.attendeeInfo[0]?.teamName,
    payment: {
      method: "Credit Card",
      amount: registrationData.paymentInfo.subtotal,
      total: registrationData.totalAmount,
      date: new Date(registrationData.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }

  return (
    <main className="bg-background text-foreground min-h-screen">
      <Header />

      {/* Success Header */}
      <section className="bg-gradient-to-r from-green-950/20 to-emerald-950/20 py-8 px-6 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-full">
              <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">Payment Successful!</h1>
          <p className="text-xl text-muted-foreground mb-2">
            Thank you for your purchase. Your {registrationData.quantity} ticket {registrationData.quantity > 1 ? 's' : ''} for{" "}
            have been confirmed.
          </p>

          <div className="flex items-center justify-center gap-2 mb-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-600">
              Confirmation email sent to {orderSummary.billingInfo.email}
            </span>
          </div>

          {registrationResult?.data?.participant?.ticketNumbers && (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">
                {isSport ? 'Participant Numbers' : 'Ticket Numbers'}: {registrationResult.data.participant.ticketNumbers.join(', ')}
              </p>
            </div>
          )}

          <p className="text-sm text-muted-foreground mt-2">
            Order ID: {orderSummary.orderId} • {orderSummary.payment.date}
          </p>
        </div>
      </section>

      {/* Summary Section */}
      <section className="py-12 px-6 md:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Left: Event/Sport Details */}
            <div className="md:col-span-2 space-y-8">
              {/* Event/Sport Card */}
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  {isSport ? (
                    <Trophy className="h-6 w-6 text-primary" />
                  ) : (
                    <Calendar className="h-6 w-6 text-primary" />
                  )}
                  <h2 className="text-2xl font-bold">{isSport ? "Sport" : "Event"} Details</h2>
                </div>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-3">{orderSummary.entity.title}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar size={16} />
                        <span>{orderSummary.entity.date}</span>
                      </div>
                      {orderSummary.entity.time && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock size={16} />
                          <span>{orderSummary.entity.time}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin size={16} />
                        <span>{orderSummary.entity.location}</span>
                      </div>
                      {isSport && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users size={16} />
                          <span>{registrationData.quantity} Participant{registrationData.quantity > 1 ? 's' : ''}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="w-full md:w-48 h-32 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                    {orderSummary.entity.image ? (
                      <img
                        src={orderSummary.entity.image}
                        alt={orderSummary.entity.title}
                        className="object-cover w-full h-full rounded-lg"
                      />
                    ) : (
                      <div className="text-muted-foreground">No image</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Billing Information */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-4">Billing Information</h2>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="text-muted-foreground">Full Name</label>
                    <p className="font-medium">{orderSummary.billingInfo.name}</p>
                  </div>
                  <div>
                    <label className="text-muted-foreground">Email</label>
                    <p className="font-medium">{orderSummary.billingInfo.email}</p>
                  </div>
                  <div>
                    <label className="text-muted-foreground">Phone</label>
                    <p className="font-medium">{orderSummary.billingInfo.phone}</p>
                  </div>
                  <div>
                    <label className="text-muted-foreground">{isSport ? 'Participants' : 'Tickets'}</label>
                    <p className="font-medium">{orderSummary.tickets[0].quantity}</p>
                  </div>
                </div>
              </div>

              {/* Team Information (if applicable) */}
              {orderSummary.teamName && (
                <div className="bg-card border border-border rounded-xl p-6">
                  <h2 className="text-2xl font-bold mb-4">Team Information</h2>
                  <div className="flex items-center gap-4">
                    <Users className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="font-semibold">Team Name</h3>
                      <p className="text-lg font-bold text-primary">{orderSummary.teamName}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Participants/Attendees Information */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-4">
                  {isSport ? 'Participants' : 'Attendees'} Information ({registrationData.quantity} {registrationData.quantity === 1 ? 'Person' : 'People'})
                </h2>
                <div className="space-y-6">
                  {orderSummary.attendees.map((attendee, index) => (
                    <div key={index} className="border border-border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <h3 className="font-semibold">
                          {isSport ? 'Participant' : 'Attendee'} {index + 1}
                        </h3>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <label className="text-muted-foreground">Full Name</label>
                          <p className="font-medium">{attendee.name}</p>
                        </div>
                        <div>
                          <label className="text-muted-foreground">ID Number</label>
                          <p className="font-medium">{attendee.idNumber}</p>
                        </div>
                        <div>
                          <label className="text-muted-foreground">Email</label>
                          <p className="font-medium">{attendee.email || 'Not specified'}</p>
                        </div>
                        <div>
                          <label className="text-muted-foreground">Age</label>
                          <p className="font-medium">{attendee.age || 'Not specified'}</p>
                        </div>
                        <div>
                          <label className="text-muted-foreground">Gender</label>
                          <p className="font-medium">{attendee.gender || 'Not specified'}</p>
                        </div>
                        {attendee.teamName && (
                          <div>
                            <label className="text-muted-foreground">Team Name</label>
                            <p className="font-medium">{attendee.teamName}</p>
                          </div>
                        )}
                      </div>

                      {registrationResult?.data?.participant?.ticketNumbers?.[index] && (
                        <div className="mt-3 pt-3 border-t border-border">
                          <label className="text-muted-foreground text-sm">
                            {isSport ? 'Participant Number' : 'Ticket Number'}
                          </label>
                          <p className="font-medium text-green-600">
                            {registrationResult.data.participant.ticketNumbers[index]}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-xl p-6 h-fit sticky top-24">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                {/* Tickets/Participations */}
                <div className="space-y-3 mb-4">
                  {orderSummary.tickets.map((ticket) => (
                    <div key={ticket.id} className="flex justify-between text-sm">
                      <div>
                        <p className="font-medium">{ticket.quantity} × {ticket.type}</p>
                        <p className="text-muted-foreground text-xs">
                          ${ticket.price.toFixed(2)} per {isSport ? 'participant' : 'ticket'}
                        </p>
                      </div>
                      <p className="font-medium">${ticket.subtotal.toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                {/* Payment Details */}
                <div className="border-t border-border pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${orderSummary.payment.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold border-t border-border pt-2">
                    <span>Total</span>
                    <span>${orderSummary.payment.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="border-t border-border pt-4 mt-4">
                  <div className="text-sm">
                    <label className="text-muted-foreground">Payment Method</label>
                    <p className="font-medium">{orderSummary.payment.method}</p>
                  </div>
                </div>

                {/* Registration Status */}
                <div className="border-t border-border pt-4 mt-4">
                  <div className="text-sm">
                    <label className="text-muted-foreground">Registration Status</label>
                    <div className="flex items-center gap-2 mt-1">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span className="text-green-600">Confirmed</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  asChild
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  <Link href={isSport ? "/sports" : "/events"}>
                    Browse More {isSport ? 'Sports' : 'Events'}
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className="w-full"
                >
                  <Link href="/">
                    Back to Home
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-12 bg-card border border-border rounded-xl p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-bold mb-4 text-center">Need Help?</h3>
            <div className="grid md:grid-cols-2 gap-6 text-sm text-center">
              <div>
                <h4 className="font-semibold mb-2">Contact Support</h4>
                <p className="text-muted-foreground">
                  Email: support@gosports.com<br />
                  Phone: +123 123 456 789
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Email Issues?</h4>
                <p className="text-muted-foreground">
                  Didn't receive your confirmation?<br />
                  Check spam folder or contact support.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
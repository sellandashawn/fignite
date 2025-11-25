"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { CheckCircle, Calendar, MapPin, Download, Share2 } from "lucide-react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { registerParticipantWithPayment } from '../api/participant'

interface RegistrationData {
  id: string
  eventId: string
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
  attendeeInfo: {
    name: string
    idNumber: string
    age: string
    gender: string
    email: string
    tshirtSize: string
    raceCategory: string
    teamName: string
  }
  paymentInfo: {
    subtotal: number
    total: number
    status: string
  }
  createdAt: string
}

export default function PaymentSuccessPage() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [registrationData, setRegistrationData] = useState<RegistrationData | null>(null)
  const [isProcessing, setIsProcessing] = useState(true)

  useEffect(() => {
    setIsClient(true)
    processRegistration()
  }, [])

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
      console.log("aaaaaaaaa", registration)

      const participantData = {
        orderId: registration.id,
        billingFirstName: registration.billingInfo.firstName || '',
        billingLastName: registration.billingInfo.lastName || '',
        billingEmail: registration.billingInfo.email || '',
        billingPhone: registration.billingInfo.phone || '',
        attendeeName: registration.attendeeInfo.name || '',
        identificationNumber: registration.attendeeInfo.idNumber || '',
        age: registration.attendeeInfo.age || '',
        gender: registration.attendeeInfo.gender || '',
        attendeeEmail: registration.attendeeInfo.email || '',
        tshirtSize: registration.attendeeInfo.tshirtSize || '',
        raceCategory: registration.attendeeInfo.raceCategory || '',
        teamName: registration.attendeeInfo.teamName || '',
        amount: registration.totalAmount,
        numberOfTickets: registration.quantity,
        paymentDate: new Date().toISOString()
      }

      console.log('Participant Data:', participantData)

      const result = await registerParticipantWithPayment(registration.eventId, participantData)

      console.log('Registration successful:', result)

      localStorage.removeItem('currentRegistration')

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
            <Link href="/events">Browse Events</Link>
          </Button>
        </div>
      </div>
    )
  }

  const orderSummary = {
    orderId: registrationData.id,
    event: {
      title: registrationData.eventName,
      date: new Date(registrationData.eventDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      location: registrationData.eventvenue,
      image: registrationData.eventimage
    },
    tickets: [
      {
        id: 1,
        type: "General Admission",
        quantity: registrationData.quantity,
        price: registrationData.paymentInfo.subtotal / registrationData.quantity,
        subtotal: registrationData.paymentInfo.subtotal
      }
    ],
    attendee: {
      name: registrationData.billingInfo.name,
      email: registrationData.billingInfo.email,
      phone: registrationData.billingInfo.phone
    },
    payment: {
      method: "Credit Card",
      amount: registrationData.paymentInfo.subtotal,
      total: registrationData.totalAmount,
      date: new Date(registrationData.createdAt).toLocaleDateString()
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
            Thank you for your purchase. Your tickets have been confirmed.
          </p>

          <div className="flex items-center justify-center gap-2 mb-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-600">
              Confirmation email sent to {orderSummary.attendee.email}
            </span>
          </div>

          <p className="text-sm text-muted-foreground">
            Order ID: {orderSummary.orderId} • {orderSummary.payment.date}
          </p>
        </div>
      </section>

      {/* Summary Section */}
      <section className="py-12 px-6 md:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Left: Event Details */}
            <div className="md:col-span-2 space-y-8">
              {/* Event Card */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-4">Event Details</h2>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-3">{orderSummary.event.title}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar size={16} />
                        <span>{orderSummary.event.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin size={16} />
                        <span>{orderSummary.event.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-full md:w-48 h-32 bg-muted rounded-lg flex items-center justify-center">
                    <img src={orderSummary.event.image} alt="Event" className="object-cover w-full h-full rounded-lg" />
                  </div>
                </div>
              </div>

              {/* Attendee Information */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-4">Attendee Information</h2>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="text-muted-foreground">Full Name</label>
                    <p className="font-medium">{orderSummary.attendee.name}</p>
                  </div>
                  <div>
                    <label className="text-muted-foreground">Email</label>
                    <p className="font-medium">{orderSummary.attendee.email}</p>
                  </div>
                  <div>
                    <label className="text-muted-foreground">Phone</label>
                    <p className="font-medium">{orderSummary.attendee.phone}</p>
                  </div>
                  <div>
                    <label className="text-muted-foreground">Tickets</label>
                    <p className="font-medium">{orderSummary.tickets[0].quantity} × {orderSummary.tickets[0].type}</p>
                  </div>
                  <div>
                    <label className="text-muted-foreground">Identification Number</label>
                    <p className="font-medium">{registrationData.attendeeInfo.idNumber}</p>
                  </div>
                  <div>
                    <label className="text-muted-foreground">Gender</label>
                    <p className="font-medium">{registrationData.attendeeInfo.gender || 'Not specified'}</p>
                  </div>
                  {registrationData.attendeeInfo.tshirtSize && (
                    <div>
                      <label className="text-muted-foreground">T-Shirt Size</label>
                      <p className="font-medium">{registrationData.attendeeInfo.tshirtSize}</p>
                    </div>
                  )}
                  {registrationData.attendeeInfo.raceCategory && (
                    <div>
                      <label className="text-muted-foreground">Race Category</label>
                      <p className="font-medium">{registrationData.attendeeInfo.raceCategory}</p>
                    </div>
                  )}
                  {registrationData.attendeeInfo.teamName && (
                    <div>
                      <label className="text-muted-foreground">Team Name</label>
                      <p className="font-medium">{registrationData.attendeeInfo.teamName}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-xl p-6 h-fit sticky top-24">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                {/* Tickets */}
                <div className="space-y-3 mb-4">
                  {orderSummary.tickets.map((ticket) => (
                    <div key={ticket.id} className="flex justify-between text-sm">
                      <div>
                        <p className="font-medium">{ticket.quantity} × {ticket.type}</p>
                      </div>
                      <p className="font-medium">${ticket.subtotal}</p>
                    </div>
                  ))}
                </div>

                {/* Payment Details */}
                <div className="border-t border-border pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${orderSummary.payment.amount}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold border-t border-border pt-2">
                    <span>Total</span>
                    <span>${orderSummary.payment.total}</span>
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
                  <Link href="/events">
                    Browse More Events
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
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

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8 px-6 md:px-8 mt-16">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 GoSports. All rights reserved. Developed by Fillorie.
          </p>
        </div>
      </footer>
    </main>
  )
}

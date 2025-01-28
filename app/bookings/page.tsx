import { getServerSession } from "next-auth"
import Header from "../_components/header"

import { authOptions } from "../_lib/auth"

import BookingItem from "../_components/booking-item"
import { getConfirmedBookings } from "../_data/get-confirmed-bookings"
import { getConcludedBookings } from "../_data/get-concluded-bookings"
import { Button } from "../_components/ui/button"
import Link from "next/link"

const Bookings = async () => {
  const session = await getServerSession(authOptions)

  if (!session?.user)
    return (
      <div className="mt-6 flex flex-col items-center justify-center gap-4 p-5 text-center">
        <h1 className="text-xl font-bold">Agendamentos</h1>
        <p className="text-gray-400">Você não tem agendamentos.</p>
        <Button variant="default" asChild>
          <Link href="/">Voltar ao menu inicial</Link>
        </Button>
      </div>
    )

  const confirmedBookings = await getConfirmedBookings()
  const concludedBookings = await getConcludedBookings()
  return (
    <>
      <div className="w-full md:mx-auto md:max-w-7xl md:px-2">
        <Header />
        <div className="space-y-3 p-5">
          <h1 className="text-xl font-bold">Agendamentos</h1>
          {confirmedBookings.length === 0 && concludedBookings.length === 0 && (
            <>
              <div className="flex flex-col">
                <p className="text-gray-400">Você não tem agendamentos.</p>
                <Button className="mt-6">
                  <Link href="/">Voltar ao menu inicial</Link>
                </Button>
              </div>
            </>
          )}
          {confirmedBookings.length > 0 && (
            <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
              Confirmados
            </h2>
          )}
          {confirmedBookings.map((booking) => (
            <BookingItem
              key={booking.id}
              booking={JSON.parse(JSON.stringify(booking))}
            />
          ))}

          {concludedBookings.length > 0 && (
            <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
              Finalizados
            </h2>
          )}
          {concludedBookings.map((booking) => (
            <BookingItem
              key={booking.id}
              booking={JSON.parse(JSON.stringify(booking))}
            />
          ))}
        </div>
      </div>
    </>
  )
}

export default Bookings

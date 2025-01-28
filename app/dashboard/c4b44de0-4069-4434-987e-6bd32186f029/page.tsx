import BookingItemDashboard from "@/app/_components/booking-item-dashboard"

import Header from "../../_components/header"
import { db } from "../../_lib/prisma"
import { authOptions } from "@/app/_lib/auth"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

const getBarbershopBookings = async () => {
  return db.booking.findMany({
    where: {
      date: {
        gte: new Date(),
      },
    },
    include: {
      service: {
        include: {
          barbershop: true,
        },
      },
    },
    orderBy: {
      date: "asc",
    },
  })
}

const Dashboard = async () => {
  const barberShopBookings = await getBarbershopBookings()
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect("/")
  }
  return (
    <>
      <Header />
      <div className="space-y-3 p-5">
        <h1 className="text-xl font-bold">Próximos agendamentos</h1>
        {barberShopBookings.length === 0 && (
          <p className="text-gray-400">Você não tem agendamentos.</p>
        )}
        {barberShopBookings.length > 0 && (
          <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
            Confirmados
          </h2>
        )}

        {barberShopBookings.map((booking) => (
          <BookingItemDashboard
            key={booking.id}
            booking={JSON.parse(JSON.stringify(booking))}
            name={booking.name}
            phone={booking.phone}
          />
        ))}
      </div>
    </>
  )
}

export default Dashboard

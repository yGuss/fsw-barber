import Header from "./_components/header"
import { Button } from "./_components/ui/button"
import { ptBR } from "date-fns/locale"
import Image from "next/image"
import { db } from "./_lib/prisma"
import BarbershopItem from "./_components/barbershop-item"
import { quickSearchOptions } from "./_constants/search"
import BookingItem from "./_components/booking-item"
import Search from "./_components/search"
import Link from "next/link"
import { authOptions } from "./_lib/auth"
import { getServerSession } from "next-auth"
import { format } from "date-fns"
import { getConfirmedBookings } from "./_data/get-confirmed-bookings"

const Home = async () => {
  const session = await getServerSession(authOptions)
  const barbershops = await db.barbershop.findMany({})

  const confirmedBookings = await getConfirmedBookings()
  return (
    <>
      <Header />
      <div className="w-full md:mx-auto md:max-w-7xl md:px-2">
        <div className="p-5">
          {/* TEXTO */}
          <h2 className="text-xl font-bold">
            Olá, {session?.user ? session.user.name : "bem vindo"}
          </h2>
          <p className="first-letter:uppercase">
            {format(new Date(), "eeee, d 'de' MMMM", {
              locale: ptBR,
            })}
          </p>
          {/* BUSCA */}
          <div className="mt-6">
            <Search />
          </div>
          {/* BUSCA RÁPIDA */}
          <div className="flex flex-col">
            <h2 className="my-4 self-end text-xs font-bold uppercase text-gray-400">
              Arraste para o lado --&gt;
            </h2>
            <div className="flex flex-row gap-2 overflow-x-scroll [&::-webkit-scrollbar]:hidden">
              {quickSearchOptions.map((option) => (
                <Button
                  className="gap-2"
                  variant="secondary"
                  key={option.title}
                  asChild
                >
                  <Link href={`/barbershops?service=${option.title}`}>
                    <Image
                      alt={option.title}
                      src={option.imageUrl}
                      width={16}
                      height={16}
                    />
                    {option.title}
                  </Link>
                </Button>
              ))}
            </div>
          </div>
          {/* IMAGEM */}

          {/* AGENDAMENTO */}
          {confirmedBookings.length > 0 && (
            <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
              Agendamentos
            </h2>
          )}
          <div className="flex gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden">
            {confirmedBookings.map((booking) => (
              <BookingItem
                key={booking.id}
                booking={JSON.parse(JSON.stringify(booking))}
              />
            ))}
          </div>
          {/* RECOMENDADOS */}
          <div className="flex flex-row justify-between">
            <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
              Recomendados
            </h2>
          </div>
          <div className="flex justify-center overflow-auto md:justify-normal [&::-webkit-scrollbar]:hidden">
            {barbershops.map((barbershop) => (
              <BarbershopItem key={barbershop.id} barbershop={barbershop} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default Home

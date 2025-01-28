import Link from "next/link"
import BarbershopItem from "../_components/barbershop-item"
import Header from "../_components/header"
import Search from "../_components/search"
import { db } from "../_lib/prisma"
import { Button } from "../_components/ui/button"

interface BarbershopsPageProps {
  searchParams: {
    title?: string
    service?: string
  }
}

const BarbershopsPage = async ({ searchParams }: BarbershopsPageProps) => {
  const barbershops = await db.barbershop.findMany({
    where: {
      OR: [
        searchParams?.title
          ? {
              name: { contains: searchParams?.title, mode: "insensitive" },
            }
          : {},
        searchParams?.service
          ? {
              services: {
                some: {
                  name: {
                    contains: searchParams?.service,
                    mode: "insensitive",
                  },
                },
              },
            }
          : {},
      ],
    },
  })
  return (
    <div className="w-full md:mx-auto md:max-w-7xl md:px-2">
      <Header />
      <div className="my-6 px-5">
        <Search />
      </div>
      <div className="px-5">
        <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
          Resultados para &quot;{searchParams.title || searchParams?.service}
          &quot;
        </h2>

        {barbershops.length === 0 ? (
          <div className="flex flex-col">
            <p className="text-gray-400">Nenhuma barbearia encontrada.</p>
            <Button className="mt-6">
              <Link href="/">Voltar ao menu inicial</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {barbershops.map((barbershop) => (
              <BarbershopItem key={barbershop.id} barbershop={barbershop} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default BarbershopsPage

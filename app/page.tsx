import { EyeIcon, FootprintsIcon, SearchIcon } from "lucide-react"
import Header from "./_components/header"
import { Button } from "./_components/ui/button"
import { Input } from "./_components/ui/input"
import Image from "next/image"
import { Card, CardContent } from "./_components/ui/card"
import { Badge } from "./_components/ui/badge"
import { Avatar, AvatarImage } from "./_components/ui/avatar"
import { db } from "./_lib/prisma"
import BarbershopItem from "./_components/barbershop-item"

const Home = async () => {
  const barbershops = await db.barbershop.findMany({})
  const popularBarbershops = await db.barbershop.findMany({
    orderBy: {
      name: "desc",
    },
  })
  return (
    <div>
      <Header />
      <div className="p-5">
        {/* TEXTO */}
        <h2 className="text-xl font-bold">Olá, Gustavo!</h2>
        <p>Terça-Feira, 06 de agosto.</p>

        {/* BUSCA */}
        <div className="mt-6 flex items-center gap-2">
          {/* md:mx-[20%] md:w-[50%] */}
          <Input placeholder="Faça sua busca" />
          <Button>
            <SearchIcon />
          </Button>
        </div>

        {/* BUSCA RÁPIDA */}
        <div className="mt-6 flex flex-row gap-2 overflow-x-scroll [&::-webkit-scrollbar]:hidden">
          <div className="flex gap-3">
            <Button className="gap-2" variant="secondary">
              <Image alt="Cabelo" src="/cabelo.svg" width={16} height={16} />
              Cabelo
            </Button>
          </div>

          <div className="flex gap-3">
            <Button className="gap-2" variant="secondary">
              <Image alt="Barba" src="/barba.svg" width={16} height={16} />
              Barba
            </Button>
          </div>

          <div className="flex gap-3">
            <Button className="gap-2" variant="secondary">
              <Image
                alt="Acabamento"
                src="/acabamento.svg"
                width={16}
                height={16}
              />
              Acabamento
            </Button>
          </div>

          <div className="flex gap-3">
            <Button className="gap-2" variant="secondary">
              <FootprintsIcon width={16} height={16} />
              Pézinho
            </Button>
          </div>

          <div className="flex gap-3">
            <Button className="gap-2" variant="secondary">
              <EyeIcon width={16} height={16} />
              Sobrancelha
            </Button>
          </div>
        </div>
        {/* IMAGEM */}
        <div className="relative mt-6 h-[150px] w-full rounded-xl">
          <Image
            alt="Agende nos melhores com FSW Barber"
            src="/banner-01.png"
            fill
            className="object-cover md:object-contain"
          />
        </div>

        {/* AGENDAMENTO */}
        <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
          Agendamentos
        </h2>
        <Card>
          <CardContent className="flex justify-between p-0">
            {/* ESQUERDA */}
            <div className="flex flex-col gap-2 py-5 pl-5">
              <Badge className="w-fit">Confirmado</Badge>
              <h3 className="font-semibold">Corte de cabelo</h3>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src="https://utfs.io/f/c97a2dc9-cf62-468b-a851-bfd2bdde775f-16p.png" />
                </Avatar>
                <p className="text-sm">Barbearia Shop</p>
              </div>
            </div>
            {/* DIREITA */}
            <div className="flex flex-col items-center justify-center border-l-2 border-solid px-5">
              <p className="text-sm">Agosto</p>
              <p className="text-2xl">06</p>
              <p className="text-sm">09:45</p>
            </div>
          </CardContent>
        </Card>

        {/* RECOMENDADOS */}
        <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
          Recomendados
        </h2>
        <div className="flex gap-4 overflow-auto [&::-webkit-scrollbar]:hidden">
          {barbershops.map((barbershop) => (
            <BarbershopItem key={barbershop.id} barbershop={barbershop} />
          ))}
        </div>

        {/* POPULARES */}
        <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
          Populares
        </h2>
        <div className="flex gap-4 overflow-auto [&::-webkit-scrollbar]:hidden">
          {popularBarbershops.map((barbershop) => (
            <BarbershopItem key={barbershop.id} barbershop={barbershop} />
          ))}
        </div>
      </div>

      <footer>
        <Card className="px-5 py-6 text-center">
          <CardContent>
            <p className="text-sm text-gray-400">
              © 2024 Copyright <span className="font-bold">FSW Barber</span>{" "}
            </p>
          </CardContent>
        </Card>
      </footer>
    </div>
  )
}

export default Home

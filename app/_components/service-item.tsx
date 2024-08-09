"use client"
import { Barbershop, BarbershopService } from "@prisma/client"
import Image from "next/image"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet"
import { Calendar } from "./ui/calendar"
import { ptBR } from "date-fns/locale"
import { useState } from "react"
import { format, set } from "date-fns"
import { createBooking } from "../_actions/create-booking"
import { useSession } from "next-auth/react"
import { toast } from "sonner"

interface ServiceItemProps {
  service: BarbershopService
  barbershop: Pick<Barbershop, "name">
}
const TIME_LIST = [
  "08:00",
  "08:15",
  "08:30",
  "08:45",
  "09:00",
  "09:15",
  "09:30",
  "09:45",
  "10:00",
  "10:15",
  "10:30",
  "10:45",
  "11:00",
  "11:15",
  "11:30",
  "11:45",
  "12:00",
  "12:15",
  "12:30",
  "12:45",
  "13:00",
  "13:15",
  "13:30",
  "13:45",
  "14:00",
  "14:15",
  "14:30",
  "14:45",
  "15:00",
  "15:15",
  "15:30",
  "15:45",
  "16:00",
  "16:15",
  "16:30",
  "16:45",
  "17:00",
  "17:15",
  "17:30",
  "17:45",
  "18:00",
]

const ServiceItem = ({ service, barbershop }: ServiceItemProps) => {
  const { data } = useSession()

  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<String | undefined>(
    undefined,
  )

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDay(date)
  }
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
  }
  const handleCreateBooking = async () => {
    try {
      if (!selectedDay || !selectedTime) return

      const hour = Number(selectedTime.split(":")[0])
      const minute = Number(selectedTime.split(":")[1])
      const newDate = set(selectedDay, {
        minutes: minute,
        hours: hour,
      })

      await createBooking({
        serviceId: service.id,
        userId: (data?.user as any).id,
        date: newDate,
      })
      toast.success("Reserva criada com sucesso!")
    } catch (error) {
      console.log(error)
      toast.error("Erro ao criar reserva!")
    }
  }
  return (
    <Card className="md:w-[720px]">
      <CardContent className="flex items-center gap-3 p-3">
        {/* IMAGEM */}
        <div className="relative max-h-[110px] min-h-[110px] min-w-[110px] max-w-[110px]">
          <Image
            alt={service.name}
            src={service.imageUrl}
            fill
            className="rounded-lg object-cover"
          />
        </div>
        {/* DIREITA */}
        <div className="flex w-full flex-col space-y-2">
          <h3 className="text-sm font-semibold">{service.name}</h3>
          <p className="text-sm text-gray-400">{service.description}</p>
          <p className="text-sm font-bold text-primary">
            {Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(Number(service.price))}
          </p>
        </div>
        {/* PREÇO E BOTÃO */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="secondary" size="sm">
              Reservar
            </Button>
          </SheetTrigger>
          <SheetContent className="px-0">
            <SheetHeader>
              <SheetTitle className="text-center">Fazer reserva</SheetTitle>
            </SheetHeader>

            <div className="border-b border-solid py-5">
              <Calendar
                mode="single"
                locale={ptBR}
                selected={selectedDay}
                onSelect={handleDateSelect}
                styles={{
                  head_cell: {
                    width: "100%",
                    textTransform: "capitalize",
                  },
                  cell: {
                    width: "100%",
                  },
                  button: {
                    width: "100%",
                  },
                  nav_button_previous: {
                    width: "32px",
                    height: "32px",
                  },
                  nav_button_next: {
                    width: "32px",
                    height: "32px",
                  },
                  caption: {
                    textTransform: "capitalize",
                  },
                }}
              />
            </div>
            {selectedDay && (
              <div className="flex gap-3 overflow-x-auto border-b border-solid p-5 px-5 [&::-webkit-scrollbar]:hidden">
                {TIME_LIST.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    className="rounded-full"
                    onClick={() => handleTimeSelect(time)}
                  >
                    {time}
                  </Button>
                ))}
              </div>
            )}

            {selectedTime && selectedDay && (
              <div className="p-5">
                <Card>
                  <CardContent className="space-y-3 p-3">
                    <div className="flex items-center justify-between">
                      <h2 className="font-bold">{service.name}</h2>
                      <p className="text-sm font-bold">
                        {Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(Number(service.price))}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <h2 className="text-sm text-gray-400">Data</h2>
                      <p className="text-sm">
                        {format(selectedDay, "d 'de' MMMM", {
                          locale: ptBR,
                        })}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <h2 className="text-sm text-gray-400">Horário</h2>
                      <p className="text-sm">{selectedTime}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <h2 className="text-sm text-gray-400">Barbearia</h2>
                      <p className="text-sm">{barbershop.name}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            <SheetFooter className="mt-5 px-5">
              <SheetClose asChild>
                <Button
                  onClick={handleCreateBooking}
                  className="w-full"
                  disabled={!selectedDay || !selectedTime}
                >
                  Confirmar
                </Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </CardContent>
    </Card>
  )
}

export default ServiceItem

"use client"
import { Barbershop, BarbershopService, Booking } from "@prisma/client"
import Image from "next/image"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet"
import { Calendar } from "./ui/calendar"
import { ptBR } from "date-fns/locale"
import { useEffect, useMemo, useState } from "react"
import { isPast, isToday, set } from "date-fns"
import { createBooking } from "../_actions/create-booking"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { getBookings } from "../_actions/get-bookings"
import { Dialog, DialogContent } from "./ui/dialog"
import SignInDialog from "./sign-in-dialog"
import BookingSummary from "./booking-summary"
import { useRouter } from "next/navigation"

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

interface GetTimeListProps {
  bookings: Booking[]
  selectedDay: Date
}

const getTimeList = ({ bookings, selectedDay }: GetTimeListProps) => {
  return TIME_LIST.filter((time) => {
    const hour = Number(time.split(":")[0])
    const minute = Number(time.split(":")[1])

    const timeIsOnThePast = isPast(
      set(new Date(), { hours: hour, minutes: minute }),
    )
    if (timeIsOnThePast && isToday(selectedDay)) {
      return false
    }
    const hasBookingOnCurrentTime = bookings.some(
      (booking) =>
        booking.date.getHours() === hour &&
        booking.date.getMinutes() === minute,
    )

    if (hasBookingOnCurrentTime) {
      return false
    }
    return true
  })
}

const ServiceItem = ({ service, barbershop }: ServiceItemProps) => {
  const { data } = useSession()
  const router = useRouter()
  const [signInDialogIsOpen, setSignInDialogIsOpen] = useState(false)
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<String | undefined>(
    undefined,
  )
  const [dayBookings, setDayBookings] = useState<Booking[]>([])
  const [bookingSheetIsOpen, setBookingSheetIsOpen] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      if (!selectedDay) return
      const bookings = await getBookings({
        date: selectedDay,
        serviceId: service.id,
      })
      setDayBookings(bookings)
    }
    fetch()
  }, [selectedDay, service.id])

  const selectedDate = useMemo(() => {
    if (!selectedDay || !selectedTime) return

    return set(selectedDay, {
      hours: Number(selectedTime?.split(":")[0]),
      minutes: Number(selectedTime?.split(":")[1]),
    })
  }, [selectedDay, selectedTime])

  const handleBookingClick = () => {
    if (data?.user) {
      return setBookingSheetIsOpen(true)
    }
    return setSignInDialogIsOpen(true)
  }

  const handleBookingSheetOpenChange = () => {
    setSelectedDay(undefined)
    setSelectedTime(undefined)
    setDayBookings([])
    setBookingSheetIsOpen(false)
  }

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDay(date)
  }
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
  }
  const handleCreateBooking = async () => {
    try {
      if (!selectedDate) return
      await createBooking({
        serviceId: service.id,
        date: selectedDate,
      })
      toast.success("Reserva criada com sucesso!", {
        action: {
          label: "Ver agendamentos",
          onClick: () => router.push("/bookings"),
        },
      })
    } catch (error) {
      console.log(error)
      toast.error("Erro ao criar reserva!")
    }
    handleBookingSheetOpenChange()
  }

  const timeList = useMemo(() => {
    if (!selectedDay) return []
    return getTimeList({ bookings: dayBookings, selectedDay })
  }, [dayBookings, selectedDay])

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
        <Sheet
          open={bookingSheetIsOpen}
          onOpenChange={handleBookingSheetOpenChange}
        >
          <Button variant="secondary" size="sm" onClick={handleBookingClick}>
            Reservar
          </Button>

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
                fromDate={new Date()}
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
                {timeList.length > 0 ? (
                  timeList.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      className="rounded-full"
                      onClick={() => handleTimeSelect(time)}
                    >
                      {time}
                    </Button>
                  ))
                ) : (
                  <p className="text-xs">
                    Não há horários disponíveis para este dia
                  </p>
                )}
              </div>
            )}

            {selectedDate && (
              <div className="p-5">
                <BookingSummary
                  barbershop={barbershop}
                  service={service}
                  selectedDate={selectedDate}
                />
              </div>
            )}
            <SheetFooter className="mt-5 px-5">
              <Button
                onClick={handleCreateBooking}
                className="w-full"
                disabled={!selectedDay || !selectedTime}
              >
                Confirmar
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </CardContent>
      <Dialog
        open={signInDialogIsOpen}
        onOpenChange={(open) => setSignInDialogIsOpen(open)}
      >
        <DialogContent className="w-[90%]">
          <SignInDialog />
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default ServiceItem

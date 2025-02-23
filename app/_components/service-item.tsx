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
import "./ui/style.css"
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

  const [customerPhone, setCustomerPhone] = useState<String>("")
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
    setCustomerPhone("")
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
        email: data?.user?.email as string,
        name: data?.user?.name as string,
        phone: customerPhone as string,
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
    console.log(customerPhone)
    handleBookingSheetOpenChange()
  }

  const timeList = useMemo(() => {
    if (!selectedDay) return []
    return getTimeList({ bookings: dayBookings, selectedDay })
  }, [dayBookings, selectedDay])

  return (
    <Card className="flex max-w-[400px] sm:min-w-[300px] md:max-w-[450px]">
      <CardContent className="flex flex-col items-center gap-3 p-3 md:flex-row">
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
          <Button
            variant="secondary"
            size="sm"
            onClick={handleBookingClick}
            className="w-full"
          >
            Reservar
          </Button>

          <SheetContent className="px-0 py-3">
            <SheetHeader>
              <SheetTitle className="text-center">Fazer reserva</SheetTitle>
            </SheetHeader>
            <div className="border-b border-solid">
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
              <div className="flex flex-col">
                <h2 className="mt-2 self-end px-2 text-xs font-bold uppercase text-gray-400">
                  Arraste para o lado --&gt;
                </h2>
                <div className="flex gap-3 overflow-x-auto border-b border-solid px-5 py-2 [&::-webkit-scrollbar]:hidden">
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
              </div>
            )}
            {selectedDate && (
              <div className="px-5 py-1">
                <BookingSummary
                  barbershop={barbershop}
                  service={service}
                  selectedDate={selectedDate}
                />
              </div>
            )}
            <div className="flex flex-col">
              <label htmlFor="phone" className="mx-5 my-2">
                Telefone:
              </label>
              <input
                type="number"
                className="input-none mx-5 rounded bg-secondary p-2"
                id="phone"
                placeholder="(DD) 9 9999-9999"
                maxLength={11}
                required
                minLength={11}
                onChange={(e) => setCustomerPhone(e.target.value)}
              />
              {customerPhone.length !== 11 && customerPhone.length != 0 ? (
                <p className="mx-5 mt-2 text-xs text-red-500">
                  O número de telefone deve estar (DD) 9 9999-9999
                </p>
              ) : (
                <></>
              )}
            </div>
            <SheetFooter className="mt-3 px-5">
              <Button
                onClick={handleCreateBooking}
                className="w-full"
                disabled={
                  !selectedDay ||
                  !selectedTime ||
                  customerPhone.length < 11 ||
                  customerPhone.length > 11
                }
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

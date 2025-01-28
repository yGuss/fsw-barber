import { format } from "date-fns"
import { Card, CardContent } from "./ui/card"
import { BarbershopService } from "@prisma/client"
import { ptBR } from "date-fns/locale"

interface BookingSummaryProp {
  service: Pick<BarbershopService, "name" | "price">
  userName: string
  selectedDate: Date
}

const BookingSummaryDashboard = ({
  service,
  userName,
  selectedDate,
}: BookingSummaryProp) => {
  return (
    <Card className="mb-1 mt-3">
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
            {format(selectedDate, "d 'de' MMMM", {
              locale: ptBR,
            })}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <h2 className="text-sm text-gray-400">Horário</h2>
          <p className="text-sm">
            {format(selectedDate, "HH:mm", { locale: ptBR })}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <h2 className="text-sm text-gray-400">Nome:</h2>
          <p className="text-sm">{userName}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default BookingSummaryDashboard

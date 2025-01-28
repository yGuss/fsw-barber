"use client"
import { SmartphoneIcon } from "lucide-react"
import { Button } from "./ui/button"
import { toast } from "sonner"

interface PhoneItemProps {
  phone: string
  owners: string
}

const PhoneItem = ({ phone, owners }: PhoneItemProps) => {
  const handleCopyPhoneClick = (phone: string) => {
    navigator.clipboard.writeText(phone)
    toast.success("Telefone copiado com sucesso!")
  }
  return (
    <div
      className="flex justify-between gap-2 md:justify-center md:gap-4"
      key={phone}
    >
      {/* ESQUERDA */}
      <div className="flex items-center gap-2">
        <SmartphoneIcon />
        <p className="text-sm">{phone}</p>
        <p className="mx-2 text-gray-500">{owners}</p>
      </div>
      {/* DIREITA */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          handleCopyPhoneClick(phone)
        }}
      >
        Copiar
      </Button>
    </div>
  )
}

export default PhoneItem

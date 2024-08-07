import { Card, CardContent } from "./card"

const Footer = () => {
  return (
    <footer>
      <Card className="px-5 py-6 text-center">
        <CardContent className="p-0">
          <p className="text-sm text-gray-400">
            © 2024 Copyright <span className="font-bold">FSW Barber</span>{" "}
          </p>
        </CardContent>
      </Card>
    </footer>
  )
}

export default Footer

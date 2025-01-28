import { Card, CardContent } from "./card"

const Footer = () => {
  return (
    <footer className="w-full md:mx-auto md:px-2">
      <Card className="px-5 py-6 text-center">
        <CardContent className="p-0">
          <p>
            CopyRight © 2025{" "}
            <span className="text-primary">Gustavo Fernandes </span>| Todos os
            Direitos Reservados
          </p>
        </CardContent>
      </Card>
    </footer>
  )
}

export default Footer

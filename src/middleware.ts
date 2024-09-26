import { NextRequest, NextResponse } from "next/server";
import { isValidPassword } from "./lib/isValidPassword";

export async function middleware(req: NextRequest) {
  if ((await isAuthenticated(req)) === false) {
    return new NextResponse("Acesso Negado", 
      { status: 401, headers: { "WWW-Authenticate": "Basic"}}) //Esse codigo em resumo gera um formulario basico do proprio navegador. Posso ver para estilizar isso melhor e configurar login page
  }                                                            //para a pagina de admins e configurar uma pagina de erro certinho. Aparentemente so funciona se for em combo                                                              
}                                                              //Todas as informacoes de login estao no .env file

async function isAuthenticated(req: NextRequest) {
  const authHeader = 
  req.headers.get("authorization") || 
  req.headers.get("Authorization")

  if (authHeader == null) return false

  const [username, password] = Buffer.from(authHeader.split(" ")[1], "base64")
  .toString()
  .split(":")

  return username === process.env.ADMIN_USERNAME && await isValidPassword(password, process.env.HASHED_ADMIN_PASSWORD as string)
}

export const config = {
  matcher: "/admin/:path*"
}
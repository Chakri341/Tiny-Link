import { redirect } from "next/navigation";
import { getAccessTokenFromCookies, verifyAccessToken } from "@/lib/auth";
import RegisterClient from "./RegisterClient";


export default function RegisterPage() {
  const token = getAccessTokenFromCookies();
  const payload = token ? verifyAccessToken(token) : null;

  if (payload) {
    redirect("/");
  }

  return <RegisterClient />;
}

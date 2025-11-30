import { redirect } from "next/navigation";
import { getAccessTokenFromCookies, verifyAccessToken } from "@/lib/auth";
import LoginClient from "./LoginClient";

export default function LoginPage() {
  const token = getAccessTokenFromCookies();
  const payload = token ? verifyAccessToken(token) : null;

  if (payload) {
    redirect("/");
  }

  return <LoginClient />;
}

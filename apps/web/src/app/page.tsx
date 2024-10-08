import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return redirect("/auth/signin");
  }

  return redirect("/chat");
}

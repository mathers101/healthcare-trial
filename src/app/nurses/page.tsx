import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { forbidden } from "next/navigation";

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user || session.user.role !== "nurse") {
    forbidden();
  }
  return <div>hi</div>;
}

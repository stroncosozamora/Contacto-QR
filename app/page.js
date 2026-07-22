import { redirect } from "next/navigation";
import { assignNextAdvisor } from "../lib/assignment";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function RedirectPage() {
  const { whatsappUrl } = await assignNextAdvisor();
  redirect(whatsappUrl);
}

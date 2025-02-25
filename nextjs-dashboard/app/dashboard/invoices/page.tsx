import { fetchCardData } from "@/app/lib/data"



export default async function Page() {
  const { totalPaidInvoices } = await fetchCardData();
  return <p>Invoices Page</p>
}
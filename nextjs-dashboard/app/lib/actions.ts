'use server';


import { z } from "zod";
import postgres from "postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'verify-full' });

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string()
})

const InvoiceDAO = FormSchema.omit({ id: true, date: true });

const getInvoiceData = (formData: FormData) => {
  return InvoiceDAO.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status')
  });
}

/**
 * ? 서버액션이라 브라우저에서는 log가 안보임 terminal에서 확인
 * @param formData 
 */
async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = getInvoiceData(formData);
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split("T")[0];
  //db에 데이터 쓰기
  await sql`INSERT INTO invoices (customer_id, amount, status, date) VALUES (${customerId}, ${amountInCents}, ${status}, ${date})`;
  //패스 유효성 검증(캐시데이터 갱신) 후 리다이렉트
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = getInvoiceData(formData);
  const amountInCents = amount * 100;
  await sql`UPDATE invoices SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status} WHERE id = ${id}`;
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}


export {
  createInvoice,
  updateInvoice
}
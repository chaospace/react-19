'use server';


import { z } from "zod";
import postgres from "postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'verify-full' });

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.'
  }),
  amount: z.coerce.number().gt(0, { message: 'Please enter an amount greater then $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.'
  }),
  date: z.string()
})

type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null
}

const InvoiceDAO = FormSchema.omit({ id: true, date: true });

const getInvoiceData = (formData: FormData) => {
  return InvoiceDAO.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status')
  });
}

/**
 * ? 서버액션이라 브라우저에서는 log가 안보임 terminal에서 확인
 * @param formData 
 */
async function createInvoice(prevState: State, formData: FormData) {
  const validateFields = getInvoiceData(formData);
  console.log('create', validateFields)
  if (!validateFields.success) {
    return {
      errors: validateFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice'
    }
  }
  const { customerId, amount, status } = validateFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split("T")[0];
  try {
    //db에 데이터 쓰기
    await sql`INSERT INTO invoices (customer_id, amount, status, date) VALUES (${customerId}, ${amountInCents}, ${status}, ${date})`;
  } catch (error) {
    // 콘솔을 통해 에러 확인
    console.error(error);
    return {
      message: 'Database Error: Failed to Create Invoice'
    };
  }
  //패스 유효성 검증(캐시데이터 갱신) 후 리다이렉트
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

async function updateInvoice(id: string, formData: FormData) {
  const validateFields = getInvoiceData(formData);
  if (!validateFields.success) {
    return {
      errors: validateFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice'
    }
  }
  const { customerId, amount, status } = validateFields.data;
  const amountInCents = amount * 100;
  try {
    await sql`UPDATE invoices SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status} WHERE id = ${id}`;
  } catch (error) {
    console.error(error);
    return {
      message: 'Database Error: Failed to Update Invoice'
    }
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

/**
 * 송장 제거 api 
 * ? url변경이 필요없을 경우는 revalidatePath만으로 캐시를 제거해 페이지 갱신이 가능.
 * @param id 
 */
async function deleteInvoice(id: string) {
  // throw new Error('Failed to Delete Invoice');
  // Unreachable code block
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
  } catch (error) {
    return {
      message: 'Database Error: Failed to delete Invoice'
    }
  }
  revalidatePath('/dashboard/invoices');
}



async function authenticate(prevState: string | undefined, formData: FormData) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials';
        default:
          return 'Something went wrong.'
      }
    }
    throw error;
  }
}

export type { State };
export {
  createInvoice,
  updateInvoice,
  deleteInvoice,
  authenticate
}
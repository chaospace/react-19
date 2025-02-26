'use server';
/**
 * ? 서버액션이라 브라우저에서는 log가 안보임 terminal에서 확인
 * @param formData 
 */
async function createInvoice(formData: FormData) {
  const rawFormData = {
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status')
  }
  console.log('rawData', rawFormData);
}



export {
  createInvoice
}
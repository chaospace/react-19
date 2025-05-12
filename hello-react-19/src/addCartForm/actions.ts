'use server';

type CartState = {
  success: boolean;
  message?: string;
  cartSize?: number;
}

const addToCart = async (_: CartState, queryData: FormData) => {
  const itemID = queryData.get("itemID");
  console.log('action-info', _, 'queryData', itemID)
  if (itemID === "1") {
    return { success: true, cartSize: 12 };
  } else {
    // Add a fake delay to make waiting noticeable.
    await new Promise(resolve => {
      setTimeout(resolve, 2000);
    });
    return { success: false, message: 'The item is sold out' };
  }
}

export type { CartState }
export { addToCart }
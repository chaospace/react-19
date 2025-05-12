import { useActionState } from "react"
import { addToCart, CartState } from "./actions";

const initialState: CartState = { success: false, message: '', cartSize: 0 };

function AddToCartForm({ itemID, itemTitle }: any) {
  const [formState, formAction, isPending] = useActionState(addToCart, initialState);

  return (
    <form action={ formAction }>
      <h2>{ itemTitle }</h2>
      <input type="hidden" name="itemID" value={ itemID } />
      <button type="submit" disabled={ isPending }>Add to Cart</button>
      { formState.success ? `Added to cart! Your cart now has ${formState.cartSize} items.` : `Fail to add to cart!. ${formState.message}` }
    </form>
  )
}

function AddToCartFormApp() {
  return (
    <>
      <AddToCartForm itemID="1" itemTitle="Javascript: The Definite Guide" />
      <AddToCartForm itemID="2" itemTitle="Javascript: The Good Parts" />
    </>
  )
}


export default AddToCartFormApp;
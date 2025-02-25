import { useRef } from "react";
import { useFormStatus } from "react-dom";
import { submitForm } from "./actions";


const UsernameForm = () => {
  // form에 자식요소라면 status를 통해 form에 상태 정보를 가져올 수 있음. 
  const { pending, data } = useFormStatus();

  return (
    <div>
      <h3>Request a Username:</h3>
      <input type="text" name="username" disabled={ pending } />
      <button type="submit" disabled={ pending }>Submit</button>
      <br />
      <p>{ data ? `Requesting ${data?.get('username')}...` : '' }</p>
    </div>
  )
}


function FormStatus() {
  const ref = useRef<HTMLFormElement>(null);
  return (
    <form ref={ ref } action={ async (formData) => {
      await submitForm(formData);
      ref.current?.reset();
    } }>
      <UsernameForm />
    </form>
  )
}


export default FormStatus;
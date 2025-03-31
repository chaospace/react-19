import { useOptimistic, useRef, useState } from "react";

type MessageVO = {
  text: string;
  sending: boolean;
  key: string | number
}

const Thread = ({ messages, sendMessage }: any) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(messages, (state, newMessage) => {
    return [...state, {
      text: newMessage,
      sending: true
    }]
  });

  // api 요청 전 message에 pending상태를 추가하는 optimistic Hook을 이용한다.
  async function formAction(formData: FormData) {
    addOptimisticMessage(formData.get('message'));
    formRef.current?.reset();
    await sendMessage(formData);
  }
  return (
    <>
      {
        optimisticMessages.map((message: MessageVO, index: number) => (
          <div key={ index }>
            { message.text }
            { !!message.sending && (<small>(...sending)</small>) }
          </div>)
        ) }
      <form ref={ formRef } action={ formAction }>
        <input type="text" name="message" placeholder="hello" />
        <button type="submit">Send</button>
      </form>
    </>
  )
}

const deliverMessage = async (message: string) => {
  // api 요청을 시뮬레이션하기 위해 1초 대기
  await new Promise(res => {
    setTimeout(res, 1000)
  })
  return message;
}

function OptimisticApp() {
  const [messages, setMessages] = useState<MessageVO[]>([
    { text: 'Hello there!', sending: false, key: 1 }
  ]);

  //api 요청 처리 액션
  async function sendMessage(formData: FormData) {
    const sentMessage = await deliverMessage((formData?.get('message') || '') as string);
    setMessages(messages => [...messages, { text: sentMessage, sending: false, key: messages.length + 1 }]);
  }
  return (
    <Thread messages={ messages } sendMessage={ sendMessage } />
  )
}


export default OptimisticApp;
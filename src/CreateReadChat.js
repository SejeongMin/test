import { useRef, useState, useEffect } from 'react';
//import { useParams } from 'react-router-dom';
import * as StompJs from '@stomp/stompjs';
//import instance from '../../utils/axiosConfig';

function CreateReadChat() {
  const [chatList, setChatList] = useState([]);
  const [chat, setChat] = useState('');

  const user_id = 3;
  const room_id = 10;
  const client = useRef({});

  const connect = () => {
    client.current = new StompJs.Client({
      brokerURL: 'ws://52.79.108.23:8080/uostime-chat',
      onConnect: () => {
        console.log('success');
        subscribe();
      },
    });
    client.current.activate();
  };

  const publish = (chat) => {
    if (!client.current.connected) return;

    client.current.publish({
      destination: '/pub/chat',
      body: JSON.stringify({
        userId: user_id,
        roomId: room_id,
        message: chat,
      }),
    });

    setChat('');
  };

  const subscribe = () => {
    client.current.subscribe('/sub/chat/' + room_id, (body) => {
      const json_body = JSON.parse(body.body);
      console.log(json_body);
      setChatList((_chat_list) => [
        ..._chat_list, json_body
      ]);
    });
    console.log(chatList);
  };

  const disconnect = () => {
    client.current.deactivate();
  };

  const handleChange = (event) => { // 채팅 입력 시 state에 값 설정
    setChat(event.target.value);
  };

  const handleSubmit = (event, chat) => { // 보내기 버튼 눌렀을 때 publish
    event.preventDefault();

    publish(chat);
  };
  
  useEffect(() => {
    connect();

    return () => disconnect();
  }, []);

  return (
    <div>
      {
        chatList?.map((chat) => {
          <div className={'chat-list'}>{chat.message}</div>
        })
      }
      <form onSubmit={(event) => handleSubmit(event, chat)}>
        <div>
          <input type={'text'} name={'chatInput'} onChange={handleChange} value={chat} />
        </div>
        <input type={'submit'} value={'의견 보내기'} />
      </form>
    </div>
  );
}

export default CreateReadChat;
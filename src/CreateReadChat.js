import { useRef, useState, useEffect } from 'react';
//import { useParams } from 'react-router-dom';
import * as StompJs from '@stomp/stompjs';
import axios from 'axios';
//import instance from '../../utils/axiosConfig';

function CreateReadChat() {
  const [chatList, setChatList] = useState([]);
  const [chat, setChat] = useState('');

  const user_id = 24;
  const room_id = 21;
  const client = useRef({});

  // const sse = new EventSource("http://localhost:8080/connect?userId=" + user_id, {
  //   headers: {
  //     Accept: "text/event-stream",
  //   },
  //  });

  // const sseConnect = () => {
  //   sse.addEventListener('connect', (e) => {
  //     console.log("sse connect")
  //     const { data: receivedConnectData } = e;
  //     console.log('connect event data: ',receivedConnectData);  // "connected!"
  //   });
  // }

  // const sseChat = () => {
  //   sse.addEventListener('chat', (e) => {
  //     const {data : receivedData} = e;
  //     console.log(receivedData);
  //   })
  // }

  const login = (uid, password) => {
    axios({
      method: 'post',
      url: 'http://localhost:8080/login',
      data: {
        uid : uid,
        password : password
    }
    });
  }

  const connect = () => {
    client.current = new StompJs.Client({
      brokerURL: 'ws://localhost:8080/uostime-chat',
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
        roomId: room_id,
        message: chat,
      }),
    });

    setChat('');
  };

  const subscribe = () => {
    
    client.current.subscribe('/sub/chat', (body) => {
      const json_body = JSON.parse(body.body);
      console.log(json_body);
      if (json_body.roomId === room_id) {
        setChatList((_chat_list) => [
          ..._chat_list, json_body
        ]);
      }
    });
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
    login();
    connect();
    // sseConnect();
    // sseChat();
    // sse.addEventListener('error', function(e) {
      // sse.close();
    // })


    return () => {
      disconnect();
      // sse.close();
    }
  }, []);


  return (
    <div>
      {
        chatList?.map((chat) => {
          return <div className={'chat-list'}>{chat.message}</div>
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
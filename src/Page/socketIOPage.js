import React, { useEffect, useRef } from "react";
import io from "socket.io-client";

const socket = io(`http://localhost:8000`);

let roomName;

export default function Main() {
  const welcomeRef = useRef();
  const welcomeFormRef = useRef();
  const roomRef = useRef();
  const nameRef = useRef();
  const msgRef = useRef();

  useEffect(() => {
    roomRef.current.hidden = true;

    socket.on("welcome", (user, newCount) => {
      const h3 = roomRef.current.querySelector("h3");
      h3.innerText = `Room ${roomName} (${newCount})`;
      addMessage(`${user} arrived!`);
    });

    socket.on("bye", (left, newCount) => {
      const h3 = roomRef.current.querySelector("h3");
      h3.innerText = `Room ${roomName} (${newCount})`;
      addMessage(`${left} left ㅠㅠ`);
    });

    socket.on("new_message", addMessage);

    socket.on("room_change", (rooms) => {
      const roomList = welcomeRef.current.querySelector("ul");
      roomList.innerHTML = "";
      if (rooms.length === 0) {
        roomList.innerHTML = "";
        return;
      }
      rooms.forEach((room) => {
        const li = document.createElement("li");
        li.innerText = room;
        roomList.append(li);
      });
    });
  }, []);

  function addMessage(message) {
    const ul = roomRef.current.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = message;
    ul.appendChild(li);
  }

  function handleRoomSubmit(event) {
    event.preventDefault();
    const input = welcomeFormRef.current.querySelector("input");
    socket.emit("enter_room", input.value, showRoom);
    roomName = input.value;
    input.value = "";
  }

  function showRoom() {
    welcomeRef.current.hidden = true;
    roomRef.current.hidden = false;
    const h3 = roomRef.current.querySelector("h3");
    h3.innerText = `Room ${roomName}`;
  }
  function handleNicknameSubmit(event) {
    event.preventDefault();
    const input = nameRef.current.querySelector("input");
    socket.emit("nickname", input.value);
  }

  function handleMessageSubmit(event) {
    event.preventDefault();
    const input = msgRef.current.querySelector("input");
    const value = input.value;
    socket.emit("new_message", input.value, roomName, () => {
      addMessage(`You: ${value}`);
    });
    input.value = "";
  }

  return (
    <>
      <header>
        <h1>Noom</h1>
      </header>
      <main>
        <div ref={welcomeRef}>
          <form onSubmit={handleRoomSubmit} ref={welcomeFormRef}>
            <input placeholder="room name" required type="text" />
            <button>Enter Room</button>
          </form>
          <h4>Open Rooms:</h4>
          <ul />
        </div>
        <div ref={roomRef}>
          <h3 />
          <ul />
          <form onSubmit={handleNicknameSubmit} ref={nameRef}>
            <input type="text" placeholder="nickname" required />
            <button>Save</button>
          </form>
          <form onSubmit={handleMessageSubmit} ref={msgRef}>
            <input type="text" placeholder="message" required />
            <button>Send</button>
          </form>
        </div>
      </main>
    </>
  );
}

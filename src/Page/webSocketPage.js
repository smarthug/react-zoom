import React, { useEffect, useRef } from 'react'

const socket = new WebSocket(`ws://localhost:8000`)

socket.addEventListener('open', () => {
    console.log("Connected to Server ✅")
})

socket.addEventListener('close', () => {
    console.log("Disconnected from Server ❌")
})

function makeMessage(type, payload) {
    const msg = { type, payload }
    return JSON.stringify(msg);
}

export default function Main() {
    const messageListRef = useRef();
    const nickFormRef = useRef();
    const messageFormRef = useRef();


    useEffect(() => {

        socket.addEventListener("message", (message) => {
            const li = document.createElement('li')
            li.innerText = message.data
            messageListRef.current.append(li)
        })

    }, [])

    function handleNickSubmit(event) {
        event.preventDefault();
        const input = nickFormRef.current.querySelector('input')
        socket.send(makeMessage("nickname", input.value))
        input.value = ""
    }

    function handleSubmit(event) {
        event.preventDefault()
        const input = messageFormRef.current.querySelector('input')
        socket.send(makeMessage('new_message', input.value))
        input.value = ""
    }

    return (
        <>
            <header>
                <h1>Noom</h1>
            </header>
            <main>
                <form onSubmit={handleNickSubmit} ref={nickFormRef}>
                    <input type="text" placeholder="choose a nickname" required />
                    <button>Save</button>
                </form>
                <ul ref={messageListRef} />
                <form onSubmit={handleSubmit} ref={messageFormRef}>
                    <input type="text" placeholder="write a msg" required />
                    <button>Send</button>
                </form>
            </main>
        </>

    )
}



// App.js
import React, { useEffect, useState } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import axios from "axios";

function App() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      await fetchEventSource("http://localhost:5000/events", {
        method: "GET",
        onmessage(event) {
          const newMessage = JSON.parse(event.data);
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        },
        onerror(err) {
          console.error("EventSource failed:", err);
        },
      });
    };

    fetchEvents();

    return () => {
      // Automatically handled by fetchEventSource, but could add cleanup if desired
    };
  }, []);

  async function handleCLICK() {
    try {
      axios.post(`http://localhost:5000/trigger-api`).then((res) => {
        console.log(res.data);
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <h1>API Event Listener</h1>
      <button onClick={handleCLICK}>CLICK ME </button>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>
            {msg.message} - {JSON.stringify(msg.result)}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

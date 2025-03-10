// App.js
import { useEffect, useState } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import moment from "moment"

function App() {
  const [messages, setMessages] = useState([]);
// fintech code added hete 
  // useEffect(() => {
  //   // alert(moment());
  //   const fetchEvents = async () => {
  //     await fetchEventSource("http://localhost:8000/events", {
  //       method: "GET",
       
      
  //       onopen(res) {
  //         if (res.ok && res.status === 200) {
  //           console.log("Connection made ", res);
  //         } else if (
  //           res.status >= 400 &&
  //           res.status < 500 &&
  //           res.status !== 429
  //         ) {
  //           console.log("Client side error ", res);
  //         }
  //       },


//
  


  // /////////////////add one extra message
  //       onmessage(event) {
  //         console.log(event.data);
  //         const newMessage = JSON.parse(event.data);
  //         setMessages((prevMessages) => [...prevMessages, newMessage]);
  //       },
  //       onclose() {
  //         console.log("Connection closed by the server");
  //       },
  //       onerror(err) {
  //         console.log("There was an error from server", err);
  //       },
  //     });
  //   };

  //   fetchEvents();

  //   return () => {
  //     // Automatically handled by fetchEventSource, but could add cleanup if desired
  //   };
  // }, []);

  async function handleCLICK() {
    try {
      // axios.post(`http://localhost:8000/trigger-api`).then((res) => {
      //   console.log(res.data);
      // });
    } catch (error) {
      console.log(error);
    }
  }


  const targetTime = "14:51:00"; // Target time in HH:mm:ss format

  useEffect(() => {
    const scheduleNotification = () => {
      // Get the current time
      const now = moment();

      // Parse the target time
      const [hours, minutes, seconds] = targetTime.split(":").map(Number);
      const todayTarget = moment().set({
        hour: hours,
        minute: minutes,
        second: seconds,
        millisecond: 0,
      });

      // Calculate the delay (in milliseconds)
      let delay = todayTarget.diff(now);

      // If the target time has already passed today, schedule for tomorrow
      if (delay < 0) {
        delay = moment(todayTarget).add(1, "day").diff(now);
      }

      // Schedule the notification


      // add more comments  here and code also
      setTimeout(() => {
        alert("It's time for the event!");
        
      }, delay);
    };

    scheduleNotification();
  }, [targetTime]); // Re-run if the target time changes








  return (
    <div>
      <h1>API Event Listener</h1>
      <button onClick={()=>handleCLICK}>CLICK ME </button>
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

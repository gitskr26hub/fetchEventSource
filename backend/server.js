// index.js
const express = require("express");
const axios = require("axios"); // To make an API request
const app = express();
const PORT = 5000;
const cors = require("cors");
app.use(cors());
let clients = [];

// SSE endpoint
app.get("/events", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Add client to the list
  //   console.log(res)
  clients.push(res);

  console.log({ clients });
  // Clean up on client disconnect
  req.on("close", () => {
    clients = clients.filter((client) => client !== res);
    res.end();
  });
});

// Function to send an event to all clients
const broadcastEvent = (data) => {
  clients.forEach((client) =>
    client.write(`data: ${JSON.stringify(data)}\n\n`)
  );
};

// Endpoint to simulate an API call and emit an event to clients on success
app.post("/trigger-api", async (req, res) => {
  try {
    console.log("hellop");
    // Simulating an API request
    const apiResponse = await axios.get(
      "https://jsonplaceholder.typicode.com/todos/1"
    );
    const data = { message: "API call succeeded", result: apiResponse.data };
    console.log(data);
    // Emit to all connected clients
    broadcastEvent(data);

    res.status(200).json({ message: "Event broadcasted to all clients", data });
  } catch (error) {
    res.status(500).json({ error: "Failed to make API request" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
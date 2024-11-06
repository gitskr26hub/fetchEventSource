import express, { Request, Response } from "express";
import axios from "axios"; // To make an API request
import cors from "cors";

const app = express();
const PORT = 5000;
const cors=cors();

app.use(cors());
let clients: Response[] = []; // Declare clients as an array of Response objects

// // Import route handlers
// import sseRoutes from "./routes/sseRoutes";
// import taskRoutes from "./routes/taskRoutes";

// SSE endpoint
app.get("/events", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Add client to the list
  clients.push(res);

  console.log({ clients });

  // Clean up on client disconnect
  req.on("close", () => {
    clients = clients.filter((client) => client !== res);
    res.end();
  });
});

// Function to send an event to all clients
const broadcastEvent = (data: any): void => {
  clients.forEach((client) =>
    client.write(`data: ${JSON.stringify(data)}\n\n`)
  );
};

// Endpoint to simulate an API call and emit an event to clients on success
app.post("/trigger-api", async (req: Request, res: Response) => {
  try {
    console.log("Starting API call");

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

// Graceful shutdown
const gracefulShutdown = (): void => {
  console.log("Initiating graceful shutdown...");
  server.close(() => {
    console.log("All connections closed. Server shutdown complete.");
    process.exit(0);
  });
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

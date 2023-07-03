import http from "http";
import {
  handleGetAllUsers,
  handleGetUserById,
  handleCreateUser,
  handleUpdateUser,
  handleDeleteUser,
} from "./routes.js";

interface WorkerArguments {
  request: any;
  response: any;
  port: string;
}

export default function startWorker(port: string) {
  const server = http.createServer(async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    const { method, url } = req;

    if (!url) return;
    if (method === "OPTIONS") {
      // Handle preflight OPTIONS request
      res.statusCode = 204;
      res.setHeader("Content-Length", "0");
      res.end();
    } else if (method === "GET" && url === "/api/users") {
      await handleGetAllUsers(req, res);
    } else if (method === "GET" && url.startsWith("/api/users/")) {
      const userId = url.split("/")[3];
      await handleGetUserById(req, res, userId);
    } else if (method === "POST" && url === "/api/users") {
      await handleCreateUser(req, res);
    } else if (method === "PUT" && url.startsWith("/api/users/")) {
      const userId = url.split("/")[3];
      await handleUpdateUser(req, res, userId);
    } else if (method === "DELETE" && url.startsWith("/api/users/")) {
      const userId = url.split("/")[3];
      await handleDeleteUser(req, res, userId);
    } else {
      res.statusCode = 404;
      res.setHeader("Content-Type", "text/plain");
      res.end("Not found");
    }
    process.on("uncaughtException", (error) => {
      console.error("Uncaught Exception:", error);
      res.statusCode = 500;
      res.setHeader("Content-Type", "text/plain");
      res.end("Internal Server Error");
    });

    process.on("unhandledRejection", (reason, promise) => {
      console.error("Unhandled Promise Rejection:", reason);
      res.statusCode = 500;
      res.setHeader("Content-Type", "text/plain");
      res.end("Internal Server Error");
    });
  });

  server.listen(port, () => {
    console.log(`Worker process started. Listening on port ${port}`);
  });
}

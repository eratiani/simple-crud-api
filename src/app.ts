// index.js
import cluster from "cluster";
import { cpus } from "os";
import http from "http";
const numCPUs = cpus().length;

if (cluster.isPrimary) {
  // Code for the master process
  for (let i = 0; i < numCPUs - 1; i++) {
    cluster.fork();
  }
  console.log("Master process started.");

  // Create a round-robin array to distribute requests
  const workers = Object.values(cluster.workers || {});
  let nextWorkerIndex = 0;

  cluster.on("exit", (worker, code, signal) => {
    console.log("later");
    console.log(
      `Worker ${worker.process.pid} exited with code ${code} and signal ${signal}.`
    );
    // Restart the worker if it exits
    cluster.fork();
  });

  // Load balancer to distribute requests
  const balancer = (req: http.IncomingMessage, res: http.ServerResponse) => {
    const worker = workers[nextWorkerIndex];
    nextWorkerIndex = (nextWorkerIndex + 1) % workers.length;
    if (!worker) return;
    worker.send({ type: "request", request: req, response: res });
  };

  // Start the load balancer
  const port = process.env.PORT || 3000;
  const server = http.createServer(balancer);
  server.listen(port, () => {
    console.log(`Load balancer listening on port ${port}`);
  });
}
// else {
//   // Code for the worker process
//   console.log(`Worker process ${cluster.worker.process.pid} started.`);

//   // Your CRUD API server implementation here
//   const app = require("./app");
//   const port = process.env.PORT + cluster.worker.id;

//   app.listen(port, () => {
//     console.log(`Worker ${cluster.worker.id} listening on port ${port}`);
//   });
// }

// const http = require("http");
// const url = require("url");
// const {
//   handleGetAllUsers,
//   handleGetUserById,
//   handleCreateUser,
//   handleUpdateUser,
//   handleDeleteUser,
// } = require("./routes");

// const port = process.env.PORT || 3000;

// const server = http.createServer((req, res) => {
//   const { pathname, query } = url.parse(req.url, true);

//   if (pathname === "/api/users" && req.method === "GET") {
//     handleGetAllUsers(req, res);
//   } else if (pathname.startsWith("/api/users/") && req.method === "GET") {
//     const userId = pathname.split("/")[3];
//     handleGetUserById(req, res, userId);
//   } else if (pathname === "/api/users" && req.method === "POST") {
//     handleCreateUser(req, res);
//   } else if (pathname.startsWith("/api/users/") && req.method === "PUT") {
//     const userId = pathname.split("/")[3];
//     handleUpdateUser(req, res, userId);
//   } else if (pathname.startsWith("/api/users/") && req.method === "DELETE") {
//     const userId = pathname.split("/")[3];
//     handleDeleteUser(req, res, userId);
//   } else {
//     res.statusCode = 404;
//     res.setHeader("Content-Type", "text/plain");
//     res.end("Not found");
//   }
// });

// server.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

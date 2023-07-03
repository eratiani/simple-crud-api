import cluster from "cluster";
import { cpus } from "os";
import http from "http";
import dotenv from "dotenv";

dotenv.config();
const numCPUs = cpus().length;
const numWorkers = numCPUs;
const port = process.env.PORT || 4000;
let currentWorkerIndex = 0;

if (cluster.isPrimary) {
  const workers: any = [];
  // Create a worker for each CPU
  for (let i = 0; i < numCPUs; i++) {
    const worker = cluster.fork();
    workers.push(worker);
  }

  // Load balancer logic

  const server = http.createServer((req, res) => {
    // Set CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );

    // Forward the request to the target worker
    const targetWorker = workers[currentWorkerIndex];
    currentWorkerIndex = (currentWorkerIndex + 1) % workers.length;
    const proxyPort = Number(port) + Number(targetWorker.id);
    const proxyReq = http.request(
      {
        host: "localhost",
        port: String(proxyPort),
        path: req.url,
        method: req.method,
        headers: req.headers,
      },
      (proxyRes) => {
        if (proxyRes.statusCode) {
          res.writeHead(proxyRes.statusCode, proxyRes.headers);
          proxyRes.pipe(res);
        } else {
          res.statusCode = 500;
          res.end("Internal Server Error");
        }
      }
    );

    req.pipe(proxyReq);
  });

  server.listen(port, () => {
    console.log(`Load balancer listening on http://localhost:${port}`);
  });
} else {
  if (process.env.PORT && cluster.worker?.id) {
    const workerPort = Number(process.env.PORT) + Number(cluster.worker.id);

    import("./worker.js")
      .then((module) => module.default(String(workerPort)))
      .catch((error) => {
        console.error("Error starting worker process:", error);
        process.exit(1);
      });
  }
}

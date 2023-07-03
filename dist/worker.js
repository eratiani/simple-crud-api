var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import http from "http";
import { handleGetAllUsers, handleGetUserById, handleCreateUser, handleUpdateUser, handleDeleteUser, } from "./routes.js";
export default function startWorker(port) {
    const server = http.createServer((req, res) => __awaiter(this, void 0, void 0, function* () {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        const { method, url } = req;
        if (!url)
            return;
        if (method === "OPTIONS") {
            // Handle preflight OPTIONS request
            res.statusCode = 204;
            res.setHeader("Content-Length", "0");
            res.end();
        }
        else if (method === "GET" && url === "/api/users") {
            yield handleGetAllUsers(req, res);
        }
        else if (method === "GET" && url.startsWith("/api/users/")) {
            const userId = url.split("/")[3];
            yield handleGetUserById(req, res, userId);
        }
        else if (method === "POST" && url === "/api/users") {
            yield handleCreateUser(req, res);
        }
        else if (method === "PUT" && url.startsWith("/api/users/")) {
            const userId = url.split("/")[3];
            yield handleUpdateUser(req, res, userId);
        }
        else if (method === "DELETE" && url.startsWith("/api/users/")) {
            const userId = url.split("/")[3];
            yield handleDeleteUser(req, res, userId);
        }
        else {
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
    }));
    server.listen(port, () => {
        console.log(`Worker process started. Listening on port ${port}`);
    });
}

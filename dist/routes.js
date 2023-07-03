var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getAllUsers, getUserById, createUser, updateUser, deleteUser, } from "./db.js";
function handleGetAllUsers(_req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield new Promise((resolve) => {
            const users = getAllUsers();
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(users));
            resolve();
        });
    });
}
function handleGetUserById(_req, res, userId) {
    const user = getUserById(userId);
    if (user) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(user));
        return user;
    }
    else {
        res.statusCode = 404;
        res.setHeader("Content-Type", "text/plain");
        res.end("User not found");
    }
}
function handleCreateUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield new Promise((resolve) => {
            let body = "";
            req.on("data", (chunk) => {
                body += chunk;
            });
            req.on("end", () => {
                const { username, age, hobbies } = JSON.parse(body);
                if (!username || !age || !hobbies) {
                    res.statusCode = 400;
                    res.setHeader("Content-Type", "text/plain");
                    res.end("Missing required fields");
                }
                else {
                    const user = createUser(username, age, hobbies);
                    res.statusCode = 201;
                    res.setHeader("Content-Type", "application/json");
                    res.end(JSON.stringify(user));
                }
                resolve();
            });
        });
    });
}
function handleUpdateUser(req, res, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield new Promise((resolve) => {
            let body = "";
            req.on("data", (chunk) => {
                body += chunk;
            });
            req.on("end", () => {
                const { username, age, hobbies } = JSON.parse(body);
                const user = updateUser(userId, username, age, hobbies);
                if (user) {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.end(JSON.stringify(user));
                }
                else {
                    res.statusCode = 404;
                    res.setHeader("Content-Type", "text/plain");
                    res.end("User not found");
                }
                resolve();
            });
        });
    });
}
function handleDeleteUser(_req, res, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield new Promise((resolve) => {
            const success = deleteUser(userId);
            if (success) {
                res.statusCode = 204;
                res.end();
                resolve(success);
            }
            else {
                res.statusCode = 404;
                res.setHeader("Content-Type", "text/plain");
                res.end("User not found");
                resolve(false);
            }
        });
    });
}
export { handleGetAllUsers, handleGetUserById, handleCreateUser, handleUpdateUser, handleDeleteUser, };

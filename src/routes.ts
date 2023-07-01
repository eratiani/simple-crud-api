import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "./db.js";
import http from "http";
function handleGetAllUsers(
  _req: http.IncomingMessage,
  res: http.ServerResponse
) {
  const users = getAllUsers();
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(users));
}

function handleGetUserById(
  _req: http.IncomingMessage,
  res: http.ServerResponse,
  userId: string
) {
  const user = getUserById(userId);
  if (user) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(user));
  } else {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain");
    res.end("User not found");
  }
}

function handleCreateUser(req: http.IncomingMessage, res: http.ServerResponse) {
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
    } else {
      const user = createUser(username, age, hobbies);
      res.statusCode = 201;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(user));
    }
  });
}

function handleUpdateUser(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  userId: string
) {
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
    } else {
      res.statusCode = 404;
      res.setHeader("Content-Type", "text/plain");
      res.end("User not found");
    }
  });
}

function handleDeleteUser(
  _req: http.IncomingMessage,
  res: http.ServerResponse,
  userId: string
) {
  const success = deleteUser(userId);
  if (success) {
    res.statusCode = 204;
    res.end();
  } else {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain");
    res.end("User not found");
  }
}
export {
  handleGetAllUsers,
  handleGetUserById,
  handleCreateUser,
  handleUpdateUser,
  handleDeleteUser,
};

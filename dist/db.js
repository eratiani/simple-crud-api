// const { v4: uuidv4 } = require("uuid");
import { v4 as uuidv4 } from "uuid";
const users = [];
function getAllUsers() {
    return users;
}
function getUserById(userId) {
    return users.find((user) => user.id === userId);
}
function createUser(username, age, hobbies) {
    const newUser = {
        id: uuidv4(),
        username,
        age,
        hobbies,
    };
    users.push(newUser);
    return newUser;
}
function updateUser(userId, username, age, hobbies) {
    const userIndex = users.findIndex((user) => user.id === userId);
    if (userIndex !== -1) {
        users[userIndex] = {
            id: userId,
            username,
            age,
            hobbies,
        };
        return users[userIndex];
    }
    return undefined;
}
function deleteUser(userId) {
    const userIndex = users.findIndex((user) => user.id === userId);
    if (userIndex !== -1) {
        users.splice(userIndex, 1);
        return true;
    }
    return false;
}
export { getAllUsers, getUserById, createUser, updateUser, deleteUser };

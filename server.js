const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const http = require("http")
const { server } = require("socket.io")



const app = express()
const server = http.createServer(app)

const io = new Server(server, {
    cors: { origin: "*" },
})

app.get("/", (req, res) => {
    res.send("Socket.io Server is running!");
});

const waitingUsers = {}


io.on("connection", (socket) => {
    console.log(`user connected: ${socket.id}`)

    socket.on("joinRoom", ({ username, room }) => {
        if (waitingUsers[room]) {
            const otherUser = waitingUsers[room]
            delete waitingUsers[room]

            socket.join(room)
            otherUser.join(room)

            io.to(room).emit("roomJoined", room)
            alert(`Room ${room} matched`)
        } else {
            waitingUsers[room] = socket
            console.log(`User ${username} is waiting in room ${room}`)
        }
    })

    socket.on("message", ({ room, message }) => {
        io.to(room).emit("message", message)
    })

    socket.on("disconnect", () => {
        console.log(`user disconnected: ${socket.id}`)
    })

})


const PORT = process.env.PORT || 8888
server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
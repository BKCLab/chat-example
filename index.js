const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);

const { faker } = require("@faker-js/faker");

const port = 3000;

app.get("/", (_req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  // generate a fake name
  const username = faker.person.firstName();

  // server emit event to only one client to set name
  socket.emit("welcome", username);

  // server notifies all clients that there is a new user
  io.emit("join", username);

  // each client send a message
  socket.on("chat", (msg) => {
    // server broadcasts message to all other clients
    io.emit("sendMsg", username, msg);
  });

  socket.on("disconnect", (reason) => {
    io.emit("leave", username, reason);
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});

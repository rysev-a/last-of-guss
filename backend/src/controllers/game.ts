import { FastifyInstance } from "fastify";
import websocket from "@fastify/websocket";

const game = (fastify: FastifyInstance, _: any, done: any) => {
  fastify
    .register(websocket, {
      options: {
        clientTracking: true,
      },
    })
    .then(() => {
      fastify.get("/hello-ws", { websocket: true }, (socket, req) => {
        socket.on("message", (socketMessage: string) => {
          const { message } = JSON.parse(socketMessage);
          broadcast(message);
        });

        socket.on("close", () => {
          console.log("Client disconnected");
        });
      });
    });

  function broadcast(message: string) {
    for (let client of fastify.websocketServer.clients) {
      client.send(JSON.stringify({ message }));
    }
  }

  done();
};

export default game;

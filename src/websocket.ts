import { Server, WebSocket } from "ws";

let wss: Server | null = null;
const clients = new Set<WebSocket>();

export function startWebSocketServer(port: number = 8080) {
    wss = new Server({ port });
    wss.on("connection", (ws: WebSocket) => {
        clients.add(ws);
        ws.on("close", () => clients.delete(ws));
    });
    console.log(`WebSocket server started on ws://localhost:${port}`);
}

export function broadcastWalletEvent(data: any) {
    const message = JSON.stringify(data);
    for (const client of clients) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    }
}

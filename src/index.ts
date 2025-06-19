import dotenv from "dotenv";
dotenv.config();

import { connectProducer, sendWalletEvent } from "./producer";
import { startConsumer } from "./consumer";
import { startWebSocketServer, broadcastWalletEvent } from "./websocket";
import { getWalletData } from "./getWalletData";

async function main() {
    await connectProducer();
    startWebSocketServer(8080);

    startConsumer(data => {
        broadcastWalletEvent(data);
    });

    setInterval(async () => {
        const walletData = await getWalletData();
        console.log("walletData", walletData);
        await sendWalletEvent(walletData);
    }, 5000);
}

main();

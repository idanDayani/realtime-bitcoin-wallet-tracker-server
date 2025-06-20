import dotenv from "dotenv";
dotenv.config();

import { connectProducer, sendWalletEvent } from "./producer";
import { startConsumer } from "./consumer";
import { startWebSocketServer, broadcastWalletEvent } from "./websocket";
import { getWalletData } from "./getWalletData";
import { RateLimitError } from "./rateLimitError";

async function main() {
    await connectProducer();
    startWebSocketServer(8080);

    startConsumer(data => {
        broadcastWalletEvent(data);
    });

    setInterval(async () => {
        try {
            const walletData = await getWalletData();
            await sendWalletEvent(walletData);
        } catch (error) {
            if (error instanceof RateLimitError) {
                broadcastWalletEvent({ isRateLimitError: true });
            } else {
                console.error("Error getting wallet data:", error);
            }
        }
    }, 5000);
}

main();

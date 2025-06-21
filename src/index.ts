import dotenv from "dotenv";
dotenv.config();

import { connectProducer, sendWalletEvent, disconnectProducer } from "./producer";
import { startWebSocketServer, broadcastWalletEvent } from "./websocket";
import { getWalletData } from "./getWalletData";
import { RateLimitError } from "./rateLimitError";
import { startWalletTrackerConsumer, disconnectWalletTrackerConsumer } from "./kafka/walletTrackerConsumer";
import { startLogConsumer, disconnectLogConsumer } from "./kafka/logConsumer";

async function main() {
    const topic = "wallet-events";
    await connectProducer();
    startWebSocketServer(8080);
    startWalletTrackerConsumer(topic, data => {
        broadcastWalletEvent(data);
    });
    startLogConsumer(topic);

    const interval = setInterval(async () => {
        try {
            const walletData = await getWalletData();
            await sendWalletEvent(topic, walletData);
        } catch (error) {
            if (error instanceof RateLimitError) {
                broadcastWalletEvent({ isRateLimitError: true });
            } else {
                console.error("Error getting wallet data:", error);
            }
        }
    }, 10000);

    const gracefulShutdown = async () => {
        console.log("Shutting down gracefully...");
        clearInterval(interval);
        await disconnectProducer();
        await disconnectWalletTrackerConsumer();
        await disconnectLogConsumer();
        process.exit(0);
    };

    process.on("SIGINT", gracefulShutdown);
    process.on("SIGTERM", gracefulShutdown);
}

main().catch(console.error);

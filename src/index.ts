import dotenv from "dotenv";
dotenv.config();

import { connectProducer } from "./kafka/producer";
import { startWebSocketServer, broadcastWalletEvent } from "./websocket";
import { startWalletTrackerConsumer } from "./kafka/walletTrackerConsumer";
import { startLogConsumer } from "./kafka/logConsumer";
import { shutdown } from "./shutdown";
import { startWalletDataPolling } from "./startWalletDataPolling";
import { BinanceWalletAddress } from "./externalAPI/fetchWalletsBTCBalances";

async function main() {
    const topic = "wallet-events";
    await connectProducer();
    startWebSocketServer(8080);
    startWalletTrackerConsumer({ topic, walletAddressToTrack: BinanceWalletAddress, onMessage: data => broadcastWalletEvent(data) });
    startLogConsumer(topic);

    const interval = setInterval(async () => {
        await startWalletDataPolling(topic);
    }, 10000);

    process.on("SIGINT", () => shutdown(interval));
    process.on("SIGTERM", () => shutdown(interval));
}

main().catch(console.error);

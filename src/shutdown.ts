import { disconnectWalletTrackerConsumer } from "./kafka/walletTrackerConsumer";
import { disconnectProducer } from "./kafka/producer";
import { disconnectLogConsumer } from "./kafka/logConsumer";

export async function shutdown(interval: NodeJS.Timeout) {
    console.log("Shutting down gracefully...");
    clearInterval(interval);
    await disconnectProducer();
    await disconnectWalletTrackerConsumer();
    await disconnectLogConsumer();
    process.exit(0);
}

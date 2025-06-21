import { Kafka, logLevel } from "kafkajs";
import { WalletData } from "./getWalletData";

const kafka = new Kafka({
    clientId: "wallet-tracker-producer",
    brokers: ["localhost:9092"],
    logLevel: logLevel.ERROR,
});

const producer = kafka.producer();

export async function connectProducer() {
    console.log("Connecting to Kafka producer...");
    await producer.connect();
}

export async function sendWalletEvent(topic: string, walletData: WalletData) {
    console.log("Sending event to Kafka");
    try {
        await producer.send({
            topic: topic,
            messages: [{ value: JSON.stringify(walletData) }],
        });
    } catch (error) {
        console.error("Error sending wallet event:", error);
    }
}

export async function sendRateLimitEvent(topic: string) {
    try {
        const rateLimitMessage = { isRateLimitError: true };
        await producer.send({
            topic: topic,
            messages: [{ value: JSON.stringify(rateLimitMessage) }],
        });
    } catch (error) {
        console.error("Error sending rate limit event:", error);
    }
}

export async function disconnectProducer() {
    console.log("Disconnecting Kafka producer...");
    await producer.disconnect();
}

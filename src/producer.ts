import { Kafka } from "kafkajs";
import { WalletData } from "./getWalletData";

const kafka = new Kafka({
    clientId: "wallet-tracker-producer",
    brokers: ["localhost:9092"],
});

const producer = kafka.producer();
const TOPIC = "wallet-events";

export async function connectProducer() {
    console.log("Connecting to Kafka");
    await producer.connect();
}

export async function sendWalletEvent(walletData: WalletData) {
    try {
        console.log("Sending wallet event to Kafka", { walletData });
        await producer.send({
            topic: TOPIC,
            messages: [{ value: JSON.stringify(walletData) }],
        });
    } catch (error) {
        console.error("Error sending wallet event:", error);
    }
}

export async function disconnectProducer() {
    await producer.disconnect();
}

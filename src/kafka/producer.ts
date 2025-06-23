import { Kafka, logLevel } from "kafkajs";
import { WalletData } from "../getWalletData";

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

// This function not in use, but keeping it here for future reference
export async function sendWalletEvent(topic: string, walletData: WalletData) {
    try {
        await producer.send({
            topic,
            messages: [{ value: JSON.stringify(walletData) }],
        });
    } catch (error) {
        console.error("Error sending wallet event:", error);
    }
}

export async function sendWalletEventsBatch(topic: string, walletDataArray: WalletData[]) {
    if (walletDataArray.length === 0) {
        return;
    }

    try {
        const messages = walletDataArray.map(walletData => ({
            value: JSON.stringify(walletData),
        }));

        await producer.send({
            topic,
            messages,
        });
    } catch (error) {
        console.error("Error sending wallet event batch:", error);
    }
}

export async function disconnectProducer() {
    console.log("Disconnecting Kafka producer...");
    await producer.disconnect();
}

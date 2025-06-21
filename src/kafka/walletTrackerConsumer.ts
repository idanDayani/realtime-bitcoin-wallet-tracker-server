import { Kafka, logLevel } from "kafkajs";

const kafka = new Kafka({
    clientId: "wallet-tracker-consumer",
    brokers: ["localhost:9092"],
    logLevel: logLevel.ERROR,
});

const consumer = kafka.consumer({ groupId: "wallet-tracker-group" });

export async function startWalletTrackerConsumer(topic: string, onMessage: (data: any) => void) {
    console.log("Starting wallet-tracker consumer...");
    await consumer.connect();
    await consumer.subscribe({ topic, fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ message }) => {
            if (message.value) {
                const data = JSON.parse(message.value.toString());
                console.log("Wallet-tracker consumer received message", { data });
                onMessage(data);
            }
        },
    });
}

export async function disconnectWalletTrackerConsumer() {
    console.log("Disconnecting wallet-tracker consumer...");
    await consumer.disconnect();
}

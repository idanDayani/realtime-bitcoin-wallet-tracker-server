import { Kafka } from "kafkajs";

const kafka = new Kafka({
    clientId: "wallet-tracker-consumer",
    brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "wallet-tracker-group" });
const TOPIC = "wallet-events";

export async function startConsumer(onMessage: (data: any) => void) {
    await consumer.connect();
    await consumer.subscribe({ topic: TOPIC, fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ message }) => {
            console.log("Received message from Kafka");
            if (message.value) {
                const data = JSON.parse(message.value.toString());
                onMessage(data);
            }
        },
    });
}

export async function disconnectConsumer() {
    await consumer.disconnect();
}

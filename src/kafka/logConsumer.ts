import { Kafka, logLevel } from "kafkajs";
import { appendFile } from "fs/promises";

const LOG_FILE = "events.log";

const kafka = new Kafka({
    clientId: "log-service-consumer",
    brokers: ["localhost:9092"],
    logLevel: logLevel.ERROR,
});

const consumer = kafka.consumer({ groupId: "log-service-group" });

export async function startLogConsumer(topic: string) {
    console.log("Starting log-service consumer...");
    await consumer.connect();
    await consumer.subscribe({ topic, fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ message }) => {
            if (message.value) {
                const walletData = JSON.parse(message.value.toString());
                console.log("Log-service consumer received message", { walletData });
                const logEntry = {
                    timestamp: new Date().toISOString(),
                    ...walletData,
                };

                try {
                    await appendFile(LOG_FILE, JSON.stringify(logEntry) + "\n");
                } catch (err) {
                    console.error("Failed to write to log file:", err);
                }
            }
        },
    });
}

export async function disconnectLogConsumer() {
    console.log("Disconnecting log-service consumer...");
    await consumer.disconnect();
}

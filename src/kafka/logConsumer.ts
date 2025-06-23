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
        eachBatch: async ({ batch }) => {
            console.log(`Log-service consumer received a batch of ${batch.messages.length} messages.`);
            const logEntries = batch.messages
                .map(message => {
                    if (!message.value) {
                        return null;
                    }
                    const walletData = JSON.parse(message.value.toString());
                    return JSON.stringify({
                        timestamp: new Date().toISOString(),
                        ...walletData,
                    });
                })
                .filter((entry): entry is string => entry !== null);

            if (logEntries.length === 0) {
                return;
            }

            try {
                await appendFile(LOG_FILE, logEntries.join("\n") + "\n");
            } catch (err) {
                console.error("Failed to write to log file:", err);
            }
        },
    });
}

export async function disconnectLogConsumer() {
    console.log("Disconnecting log-service consumer...");
    await consumer.disconnect();
}

import { getWalletsData } from "./getWalletData";
import { RateLimitError } from "./rateLimitError";
import { sendWalletEventsBatch } from "./kafka/producer";
import { broadcastWalletEvent } from "./websocket";

export async function startWalletDataPolling(topic: string) {
    try {
        const walletsData = await getWalletsData();
        await sendWalletEventsBatch(topic, walletsData);
    } catch (error) {
        if (error instanceof RateLimitError) {
            broadcastWalletEvent({ isRateLimitError: true });
        } else {
            console.error("Error getting wallet data:", error);
        }
    }
}

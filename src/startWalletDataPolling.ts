import { getWalletData } from "./getWalletData";
import { RateLimitError } from "./rateLimitError";
import { sendWalletEvent } from "./kafka/producer";
import { broadcastWalletEvent } from "./websocket";

export async function startWalletDataPolling(topic: string) {
    try {
        const walletData = await getWalletData();
        await sendWalletEvent(topic, walletData);
    } catch (error) {
        if (error instanceof RateLimitError) {
            broadcastWalletEvent({ isRateLimitError: true });
        } else {
            console.error("Error getting wallet data:", error);
        }
    }
}

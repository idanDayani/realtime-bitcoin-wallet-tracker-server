import axios from "axios";
import { RateLimitError } from "../rateLimitError";

export const BinanceWalletAddress = "34xp4vRoCGJym3xR7yCVPFHoCNxv4Twseo";
export const RobinhoodWalletAddress = "bc1ql49ydapnjafl5t2cp9zqpjwe6pdgmxy98859v2";
const BLOCKCYPHER_BASE_URL = "https://api.blockcypher.com/v1/btc/main/addrs";
const BLOCKCYPHER_TOKEN = process.env.BLOCKCYPHER_TOKEN;

export async function fetchWalletsBTCBalances(): Promise<{ binanceWalletBalance: number; robinhoodWalletBalance: number }> {
    try {
        const url = `${BLOCKCYPHER_BASE_URL}/${BinanceWalletAddress};${RobinhoodWalletAddress}?token=${BLOCKCYPHER_TOKEN}`;
        const [binanceWallet, robinhoodWallet] = (await axios.get(url)).data;
        const binanceWalletBalance = binanceWallet.balance / 100000000;
        const robinhoodWalletBalance = robinhoodWallet.balance / 100000000;
        return { binanceWalletBalance, robinhoodWalletBalance };
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 429) {
            throw new RateLimitError();
        }
        console.error("Error fetching wallet data:", error);
        throw error;
    }
}

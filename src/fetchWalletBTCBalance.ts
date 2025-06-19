import axios from "axios";

const BLOCKCYPHER_BASE_URL = "https://api.blockcypher.com/v1/btc/main/addrs";
const BLOCKCYPHER_TOKEN = process.env.BLOCKCYPHER_TOKEN;
const WALLET_ADDRESS = "34xp4vRoCGJym3xR7yCVPFHoCNxv4Twseo";

export async function fetchWalletBTCBalance(): Promise<number> {
    try {
        const url = `${BLOCKCYPHER_BASE_URL}/${WALLET_ADDRESS}?token=${BLOCKCYPHER_TOKEN}`;
        const { balance: balanceInSatoshis } = (await axios.get(url)).data;
        return balanceInSatoshis / 100000000;
    } catch (error) {
        console.error("Error fetching wallet data:", error);
        throw error;
    }
}

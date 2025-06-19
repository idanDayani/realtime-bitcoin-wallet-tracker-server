import axios from "axios";

export async function fetchBTCUSDPrice(): Promise<number> {
    try {
        const url = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd";
        const { bitcoin } = (await axios.get(url)).data;
        return bitcoin.usd;
    } catch (error) {
        console.error("Error fetching BTC price:", error);
        throw error;
    }
}

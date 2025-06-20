import { fetchBTCUSDPrice } from "./fetchBTCUSDPrice";
import { fetchWalletBTCBalance } from "./fetchWalletBTCBalance";

export interface WalletData {
    balanceBTC: number;
    btcUsdPrice: number;
    balanceUSD: number;
}

export async function getWalletData() {
    const [balanceBTC, btcUsdPrice] = await Promise.all([fetchWalletBTCBalance(), fetchBTCUSDPrice()]);
    return {
        balanceBTC,
        btcUsdPrice,
        balanceUSD: balanceBTC * btcUsdPrice,
    };
}

import { fetchBTCUSDPrice } from "./externalAPI/fetchBTCUSDPrice";
import { BinanceWalletAddress, fetchWalletsBTCBalances, RobinhoodWalletAddress } from "./externalAPI/fetchWalletsBTCBalances";

export interface WalletData {
    walletAddress: string;
    balanceBTC: number;
    btcUsdPrice: number;
    balanceUSD: number;
}

export async function getWalletsData() {
    const [{ binanceWalletBalance, robinhoodWalletBalance }, btcUsdPrice] = await Promise.all([fetchWalletsBTCBalances(), fetchBTCUSDPrice()]);
    return [
        {
            walletAddress: BinanceWalletAddress,
            balanceBTC: binanceWalletBalance,
            btcUsdPrice,
            balanceUSD: binanceWalletBalance * btcUsdPrice,
        },
        {
            walletAddress: RobinhoodWalletAddress,
            balanceBTC: robinhoodWalletBalance,
            btcUsdPrice,
            balanceUSD: robinhoodWalletBalance * btcUsdPrice,
        },
    ];
}

export async function fetchCoins(page: number, perPage: number = 10) {
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&sparkline=true&page=${page}&per_page=${perPage}&order=market_cap_desc`;

    const res = await fetch(url);

    if (!res.ok) {
        throw new Error("Failed to fetch coins");
    }

    return res.json();
}

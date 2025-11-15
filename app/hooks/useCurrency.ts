import { useQuery } from "@tanstack/react-query";

export function useCoins(page: number, perPage: number) {
    return useQuery({
        queryKey: ["coins", page, perPage],

        queryFn: async () => {
            const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=${perPage}&page=${page}`;

            try {
                const res = await fetch(url);
                if (!res.ok) throw new Error("Network Error");
                const data = await res.json();
                localStorage.setItem(`coins-cache-${page}`, JSON.stringify(data));
                return data;
            } catch (err) {
                console.warn("Offline mode: trying cached data...");

                const cached = localStorage.getItem(`coins-cache-${page}`);

                if (cached) {
                    return JSON.parse(cached);
                }
                throw new Error("Offline and no cached data");
            }
        },

        retry: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
    });
}

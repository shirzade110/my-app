import { useQuery } from "@tanstack/react-query";
import { fetchCoins } from "../services/coinService";

export function useCoins(page: number, perPage: number = 10) {
    return useQuery({
        queryKey: ["coins", page, perPage],

        queryFn: async () => {
            try {
                const data = await fetchCoins(page, perPage);
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

        staleTime: 1000 * 60 * 2,
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
    });
}

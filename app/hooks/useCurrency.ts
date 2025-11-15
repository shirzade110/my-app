import { useQuery } from "@tanstack/react-query";
import { fetchCoins } from "../services/coinService";

export function useCoins(page: number, perPage: number = 10) {
    return useQuery({
        queryKey: ["coins", page, perPage],
        queryFn: () => fetchCoins(page, perPage),
        staleTime: 1000 * 60 * 2,
    });
}

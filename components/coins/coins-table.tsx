import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Star } from "lucide-react";
import { Sparklines, SparklinesLine } from "react-sparklines";

interface CoinTableProps {
  data: any[];
  onFavoritesChange?: (favorites: any[]) => void;
}

export default function CoinsTable({
  data,
  onFavoritesChange,
}: CoinTableProps) {
  const [favorites, setFavorites] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("favorites");
    if (stored) setFavorites(JSON.parse(stored));
  }, []);

  const toggleFavorite = (coin: any) => {
    let updatedFavorites: any[];

    if (favorites.find((fav) => fav.id === coin.id)) {
      updatedFavorites = favorites.filter((fav) => fav.id !== coin.id);
    } else {
      updatedFavorites = [...favorites, coin];
    }

    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    if (onFavoritesChange) onFavoritesChange(updatedFavorites);
  };

  return (
    <div className="space-y-4">
      {/* Desktop Table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead>Coin</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Market Cap</TableHead>
              <TableHead className="text-right">24h Change</TableHead>
              <TableHead className="text-right">7d</TableHead> {/* Sparkline */}
              <TableHead className="text-right">Favorite</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data?.map((coin, index) => {
              const isFavorite = favorites.some((fav) => fav.id === coin.id);
              return (
                <TableRow key={`${coin.id}-${index}`}>
                  <TableCell>{index + 1}</TableCell>

                  <TableCell className="flex items-center gap-2">
                    <img src={coin.image} alt={coin.name} className="w-6 h-6" />
                    {coin.name}
                  </TableCell>

                  <TableCell>${coin.current_price.toLocaleString()}</TableCell>

                  <TableCell>${coin.market_cap.toLocaleString()}</TableCell>

                  <TableCell
                    className={`text-right ${
                      coin.price_change_percentage_24h > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {coin.price_change_percentage_24h.toFixed(2)}%
                  </TableCell>

                  <TableCell className="text-right w-[100px]">
                    {coin.sparkline_in_7d?.price ? (
                      <Sparklines
                        data={coin.sparkline_in_7d.price}
                        width={100}
                        height={30}
                      >
                        <SparklinesLine
                          color={
                            coin.sparkline_in_7d.price[0] <
                            coin.sparkline_in_7d.price[
                              coin.sparkline_in_7d.price.length - 1
                            ]
                              ? "green"
                              : "red"
                          }
                        />
                      </Sparklines>
                    ) : (
                      "-"
                    )}
                  </TableCell>

                  <TableCell className="text-right">
                    <button
                      onClick={() => toggleFavorite(coin)}
                      className="p-1 hover:text-yellow-500 transition"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          isFavorite ? "text-yellow-400" : "text-gray-400"
                        }`}
                      />
                    </button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="flex flex-col space-y-4 md:hidden">
        {data?.map((coin, index) => {
          const isFavorite = favorites.some((fav) => fav.id === coin.id);
          return (
            <div
              key={`${coin.id}-${index}`}
              className="border rounded-lg p-4 shadow-sm flex justify-between  gap-2"
            >
              <div className="flex items-center gap-3">
                <span className="font-semibold">{index + 1}.</span>
                <img src={coin.image} alt={coin.name} className="w-8 h-8" />
                <div>
                  <div className="font-semibold">{coin.name}</div>
                  <div className="text-sm text-gray-500">
                    ${coin.current_price.toLocaleString()}
                  </div>
                  <div
                    className={`text-sm font-medium ${
                      coin.price_change_percentage_24h > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {coin.price_change_percentage_24h.toFixed(2)}%
                  </div>
                </div>
              </div>

              <div className="mt-1 w-[120px]">
                {coin.sparkline_in_7d?.price ? (
                  <Sparklines
                    data={coin.sparkline_in_7d.price}
                    width={120}
                    height={40}
                  >
                    <SparklinesLine
                      color={
                        coin.sparkline_in_7d.price[0] <
                        coin.sparkline_in_7d.price[
                          coin.sparkline_in_7d.price.length - 1
                        ]
                          ? "green"
                          : "red"
                      }
                    />
                  </Sparklines>
                ) : (
                  "-"
                )}
              </div>

              <div className=" justify-end">
                <button
                  onClick={() => toggleFavorite(coin)}
                  className="p-1 hover:text-yellow-500 transition"
                >
                  <Star
                    className={`w-5 h-5 ${
                      isFavorite ? "text-yellow-400" : "text-gray-400"
                    }`}
                  />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

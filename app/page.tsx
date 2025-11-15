"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useCoins } from "./hooks/useCurrency";
import CoinsTable from "@/components/coins/coins-table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Switch } from "@/components/ui/switch";

export default function CoinsPage() {
  const perPage = 10;

  const [page, setPage] = useState(1);
  const [mobilePage, setMobilePage] = useState(1);
  const [allCoins, setAllCoins] = useState<any[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [favoriteCoins, setFavoriteCoins] = useState<any[]>([]);

  const {
    data: desktopData,
    isLoading: desktopLoading,
    isError: desktopError,
    refetch: refetchDesktop,
  } = useCoins(page, perPage);

  const {
    data: mobileData,
    isLoading: mobileLoading,
    isFetching,
    isError: mobileError,
    refetch: refetchMobile,
  } = useCoins(mobilePage, perPage);

  const observer = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem("favorites");
    if (stored) setFavoriteCoins(JSON.parse(stored));
  }, []);

  useEffect(() => {
    if (mobileData && mobileData.length > 0 && !showFavorites) {
      setAllCoins((prev) => [...prev, ...mobileData]);
    }
  }, [mobileData, showFavorites]);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && !showFavorites) {
        setMobilePage((prev) => prev + 1);
      }
    },
    [showFavorites]
  );

  useEffect(() => {
    if (!loadMoreRef.current) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    });

    observer.current.observe(loadMoreRef.current);

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [allCoins, showFavorites, handleObserver]);

  const coinsToDisplayDesktop = showFavorites
    ? favoriteCoins
    : desktopData || [];
  const coinsToDisplayMobile = showFavorites ? favoriteCoins : allCoins || [];

  const totalPages = 10;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const DesktopSkeleton = () => (
    <div className="animate-pulse space-y-2 p-5">
      {Array.from({ length: perPage }).map((_, idx) => (
        <div
          key={idx}
          className="h-12 bg-gray-300 rounded w-full md:w-[100%]"
        ></div>
      ))}
    </div>
  );

  const MobileSkeleton = () => (
    <div className="animate-pulse space-y-4 p-5">
      {Array.from({ length: perPage }).map((_, idx) => (
        <div key={idx} className="h-20 bg-gray-300 rounded w-full"></div>
      ))}
    </div>
  );

  const ErrorMessage = ({ onRetry }: { onRetry: () => void }) => (
    <div className="p-5 text-center text-red-600 space-y-2">
      <p>Error loading coins. Please try again.</p>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
      >
        Retry
      </button>
    </div>
  );

  return (
    <div className="space-y-6 md:border lg:border md:m-5 lg:m-5">
      {/* Header */}
      <div className="items-center">
        <div className="border-b p-5">
          <h1 className="text-2xl font-semibold">Crypto Prices</h1>
        </div>

        <div className="flex items-center justify-between md:justify-start lg:justify-start gap-5 p-5">
          <span>Favorites Only Mode</span>
          <Switch
            checked={showFavorites}
            onCheckedChange={(checked) => setShowFavorites(checked)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
            ${showFavorites ? "bg-yellow-400" : "bg-gray-300"}`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                showFavorites ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </Switch>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:block lg:block m-5 md:border lg:border">
        {desktopLoading && !showFavorites ? (
          <DesktopSkeleton />
        ) : desktopError ? (
          <ErrorMessage onRetry={refetchDesktop} />
        ) : (
          <CoinsTable
            data={coinsToDisplayDesktop}
            onFavoritesChange={(updatedFavorites) =>
              setFavoriteCoins(updatedFavorites)
            }
          />
        )}

        {!showFavorites && !desktopLoading && !desktopError && (
          <div className="flex justify-end p-5">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className={
                      page === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>

                {pages.map((num) => (
                  <PaginationItem key={num}>
                    <PaginationLink
                      isActive={num === page}
                      onClick={() => setPage(num)}
                    >
                      {num}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext onClick={() => setPage((p) => p + 1)} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      <div className="md:hidden lg:hidden m-5 md:border lg:border">
        {mobileLoading && !showFavorites ? (
          <MobileSkeleton />
        ) : mobileError ? (
          <ErrorMessage onRetry={refetchMobile} />
        ) : (
          <>
            <CoinsTable
              data={coinsToDisplayMobile}
              onFavoritesChange={(updatedFavorites) =>
                setFavoriteCoins(updatedFavorites)
              }
            />

            {!showFavorites && !mobileError && (
              <div ref={loadMoreRef} className="flex justify-center p-5">
                {isFetching && (
                  <div className="h-16 w-full animate-pulse bg-gray-300 rounded"></div>
                )}
                {!isFetching && <p>Scroll down to load more</p>}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

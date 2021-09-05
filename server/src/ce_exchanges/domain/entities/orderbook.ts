interface PriceVolumenEntry {
  price: number;
  volume: number;
}

export interface OrderBook {
  symbol: string;
  asks: PriceVolumenEntry[];
  bids: PriceVolumenEntry[];
}

export interface OrderBooksResponse {
  result?: OrderBook[];
  error?: string;
}

export interface OrderBookRequestParameters {
  symbol: string;
  limit: number;
}

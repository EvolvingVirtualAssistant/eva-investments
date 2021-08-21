
interface Fee {
    volume: number,
    fee: number
}

interface Precision {
    price?: number,
    amount?: number
}

interface ValueLimit {
    min?: number, 
    max?: number
}

interface Limit {
    amount?: ValueLimit,
    price?: ValueLimit
}

export interface Market {
    id: string,
    base: string,
    quote: string,
    basedId: string,
    quoteId: string,
    active: boolean,
    taker?: Fee[],
    maker?: Fee[],
    feePercentage: boolean,
    precision?: Precision,
    limits?: Limit
}

export interface MarketDataResponse {
    result?: Market[],
    error?: string
}
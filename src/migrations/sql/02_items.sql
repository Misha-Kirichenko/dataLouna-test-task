CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    market_hash_name VARCHAR(255) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    suggested_price DOUBLE PRECISION NOT NULL,
    item_page VARCHAR(255) NOT NULL,
    market_page VARCHAR(255) NOT NULL,
    min_tradable_price DOUBLE PRECISION NOT NULL,
    min_non_tradable_price DOUBLE PRECISION NOT NULL,
    max_price DOUBLE PRECISION NOT NULL,
    mean_price DOUBLE PRECISION NOT NULL,
    quantity INTEGER NOT NULL,
    created_at BIGINT NOT NULL,
    updated_at BIGINT NOT NULL
);
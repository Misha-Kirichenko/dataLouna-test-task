CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    market_hash_name VARCHAR(255) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    suggested_price DECIMAL(10, 2) NOT NULL,
    item_page TEXT NOT NULL,
    market_page TEXT NOT NULL,
    min_price DECIMAL(10, 2),
    max_price DECIMAL(10, 2),
    mean_price DECIMAL(10, 2),
    quantity INTEGER NOT NULL,
    created_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT,
    updated_at BIGINT NOT NULL DEFAULT 0
);

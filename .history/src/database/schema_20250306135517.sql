CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    icon TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('INCOME', 'EXPENSE')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert default categories
INSERT INTO categories (name, icon, type) VALUES
    ('Food', 'food', 'EXPENSE'),
    ('Transport', 'car', 'EXPENSE'),
    ('Shopping', 'shopping', 'EXPENSE'),
    ('Entertainment', 'movie', 'EXPENSE'),
    ('Bills', 'file-document', 'EXPENSE'),
    ('Salary', 'cash-multiple', 'INCOME'),
    ('Investment', 'chart-line', 'INCOME'),
    ('Other', 'dots-horizontal', 'EXPENSE');

-- Add foreign key to transactions table
ALTER TABLE transactions ADD COLUMN category_id INTEGER REFERENCES categories(id);
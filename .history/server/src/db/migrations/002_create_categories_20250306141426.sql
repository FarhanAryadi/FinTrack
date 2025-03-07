CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    icon VARCHAR(255) NOT NULL,
    type VARCHAR(10) NOT NULL CHECK (type IN ('INCOME', 'EXPENSE')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default categories
INSERT INTO categories (name, icon, type) VALUES
    ('Food', 'food', 'EXPENSE'),
    ('Transport', 'car', 'EXPENSE'),
    ('Shopping', 'shopping-outline', 'EXPENSE'),
    ('Entertainment', 'movie-open', 'EXPENSE'),
    ('Bills', 'file-document-outline', 'EXPENSE'),
    ('Salary', 'cash-multiple', 'INCOME'),
    ('Investment', 'chart-line', 'INCOME'),
    ('Other Income', 'plus-circle-outline', 'INCOME'),
    ('Other Expense', 'minus-circle-outline', 'EXPENSE'); 
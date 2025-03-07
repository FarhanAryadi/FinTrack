export interface Category {
    id: number;
    name: string;
    icon: string;
    type: 'INCOME' | 'EXPENSE';
    created_at?: string;
    updated_at?: string;
} 
import * as SQLite from 'expo-sqlite';

class Database {
	private db: SQLite.WebSQLDatabase;

	constructor() {
		this.db = SQLite.openDatabase('finance_tracker.db');
		this.init();
	}

	private init() {
		const schema = require('./schema').default;
		this.db.transaction((tx) => {
			schema.split(';').forEach((statement: string) => {
				if (statement.trim()) {
					tx.executeSql(statement);
				}
			});
		});
	}

	async getAllAsync<T>(query: string, params: any[] = []): Promise<T[]> {
		return new Promise((resolve, reject) => {
			this.db.transaction((tx) => {
				tx.executeSql(
					query,
					params,
					(_, { rows: { _array } }) => resolve(_array),
					(_, error) => {
						reject(error);
						return false;
					}
				);
			});
		});
	}

	async getOneAsync<T>(query: string, params: any[] = []): Promise<T | null> {
		const results = await this.getAllAsync<T>(query, params);
		return results[0] || null;
	}

	async runAsync(query: string, params: any[] = []): Promise<void> {
		return new Promise((resolve, reject) => {
			this.db.transaction((tx) => {
				tx.executeSql(
					query,
					params,
					() => resolve(),
					(_, error) => {
						reject(error);
						return false;
					}
				);
			});
		});
	}
}

export const database = new Database();

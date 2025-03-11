import { NavigatorScreenParams } from '@react-navigation/native';
import { Transaction } from './transaction';

export type RootStackParamList = {
	Transactions: NavigatorScreenParams<TransactionsStackParamList>;
};

export type TransactionsStackParamList = {
	TransactionsList: undefined;
	TransactionDetails: { transaction: Transaction };
};

declare global {
	namespace ReactNavigation {
		interface RootParamList extends RootStackParamList {}
	}
}

import { NavigatorScreenParams } from '@react-navigation/native';
import { Transaction } from './transaction';

export type RootStackParamList = {
	Home: undefined;
	AddTransaction: undefined;
	EditTransaction: { id: number };
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

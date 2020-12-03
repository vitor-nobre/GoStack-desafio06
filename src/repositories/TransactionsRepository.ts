import { EntityRepository, Repository } from 'typeorm';
import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactionsIncome = await this.find();

    let income = 0;

    let outcome = 0;

    if (transactionsIncome) {
      transactionsIncome.map(transaction => {
        if (transaction.type === 'income') {
          income += Number(transaction.value);
        } else {
          outcome += Number(transaction.value);
        }
        return transaction;
      });
    }
    const total = income - outcome;

    const balance: Balance = {
      income,
      outcome,
      total,
    };

    return balance;
  }
}

export default TransactionsRepository;

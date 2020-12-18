import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import TransactionRepository from '../repositories/TransactionsRepository';
import CreateCategoryService from './CreateCategoryService';

interface Request {
  title: string;
  value: number;
  category: string;
  type: string;
}

class CreateTransactionService {
  public async execute({
    title,
    type,
    category,
    value,
  }: Request): Promise<Transaction> {
    if (type !== 'income' && type !== 'outcome') {
      throw new AppError('Invalid Transaction');
    }

    const transactionRepository = getCustomRepository(TransactionRepository);

    const balance = await transactionRepository.getBalance();

    if (type === 'outcome') {
      if (balance.total.valueOf() - value < 0) {
        throw new AppError('Saldo insuficiente');
      }
    }

    const categoryService = new CreateCategoryService();

    const createdCategory = await categoryService.execute({ title: category });

    const createdTransaction = await transactionRepository.create({
      value,
      category_id: createdCategory.id,
      title,
      type,
    });

    await transactionRepository.save(createdTransaction);

    return createdTransaction;
  }
}

export default CreateTransactionService;

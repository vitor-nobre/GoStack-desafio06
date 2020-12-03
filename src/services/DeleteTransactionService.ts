import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';

interface Param {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Param): Promise<void> {
    const transactionRepository = getRepository(Transaction);

    const transaction = await transactionRepository.findOne({ where: { id } });
    if (transaction) {
      await transactionRepository.remove(transaction);
    } else {
      throw new AppError('Transaction not found', 404);
    }
  }
}

export default DeleteTransactionService;

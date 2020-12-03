import { getRepository } from 'typeorm';
import Category from '../models/Category';

interface Request {
  title: string;
}

class CreateCategoryService {
  public async execute({ title }: Request): Promise<Category> {
    const categoryRepository = getRepository(Category);

    const category = await categoryRepository.findOne({ where: { title } });

    if (category) {
      return category;
    }

    const createdCategory = await categoryRepository.create({
      title,
    });
    await categoryRepository.save(createdCategory);
    return createdCategory;
  }
}

export default CreateCategoryService;

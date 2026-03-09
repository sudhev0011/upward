import { User } from '../../../entities/user.entity';
import { IBaseRepository } from '../base/IBaseRepository';

export interface IUserRepository extends IBaseRepository<User> {
  findByIds(ids: string[]): Promise<User[]>;
}
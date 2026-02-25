import bcrypt from 'bcryptjs'
import { IPasswordHasher } from '../../domain/interfaces/services/IPasswordHasher';

export class BcryptPasswordHasher implements IPasswordHasher {
  async hash(plain: string): Promise<string> {
    const rounds = Number('10');
    return bcrypt.hash(plain, rounds);
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }
}
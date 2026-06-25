import { Wallet } from "../../domain/entities/wallet.entity";
import { UserRole } from "../../domain/enums/user-role.enum";
import { IUserRepository } from "../../domain/interfaces/repositories/user/IUserRepository";
import { IWalletRepository } from "../../domain/interfaces/repositories/wallet/IWalletRepository";

export class SystemUserInitializer {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly walletRepository: IWalletRepository,
  ) {}

  async initialize(): Promise<void> {
    let systemUser = await this.userRepository.findOne({
      email: "system.upward@gmail.com",
      roles: [UserRole.SYSTEM]
    });

    if (!systemUser) {
      systemUser = await this.userRepository.create({
        name: "Upward Platform",
        email: "system.upward@gmail.com",
        password: "$2b$10$En09k32EFWUViU2B2fOjKeBsqWx4UJsFLTNSp/hbelRoCPhwQ7Dt.",
        roles: [UserRole.SYSTEM],
        avatarFileName: null,
        isVerified: true,
        isBlocked: false,
        refreshToken: null,
      });
    }
    
    const wallet = await this.walletRepository.findByUserId(systemUser.id);

    if (!wallet) {
      await this.walletRepository.create(Wallet.create({ userId: systemUser.id!}));
    }
  }
}

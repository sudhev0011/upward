import { UserRepository } from "../persistence/mongodb/repositories/user.repository";
import { WalletRepository } from "../persistence/mongodb/repositories/wallet.repository";
import { SystemUserInitializer } from "../startups/system-user.initializer";

const userRepository =
  new UserRepository();

const walletRepository =
  new WalletRepository();

export const systemUserInitializer =
  new SystemUserInitializer(
    userRepository,
    walletRepository,
  );
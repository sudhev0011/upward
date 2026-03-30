import { IEncryptionService } from "../../domain/interfaces/services/IEncryptionService";
import crypto from "crypto";
import { env } from "../config/env";

export class EncryptionService implements IEncryptionService {
  private algorithm = "aes-256-cbc";
  private key = Buffer.from(env.ENCRYPTION_KEY!, "hex");
  private ivLength = 16;

  encrypt(text: string): string {
    const iv = crypto.randomBytes(this.ivLength);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);

    const encrypted = Buffer.concat([
      cipher.update(text, "utf8"),
      cipher.final(),
    ]);

    return iv.toString("hex") + ":" + encrypted.toString("hex");
  }

  decrypt(text: string): string {
    const [ivHex, encryptedHex] = text.split(":");

    const iv = Buffer.from(ivHex, "hex");
    const encrypted = Buffer.from(encryptedHex, "hex");

    const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);

    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]);

    return decrypted.toString("utf8");
  }
}

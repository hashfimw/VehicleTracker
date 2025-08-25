import bcrypt from "bcryptjs";

export class PasswordUtil {
  private static readonly SALT_ROUNDS = 12;

  static async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, this.SALT_ROUNDS);
  }

  static async verify(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  static validate(password: string): boolean {
    const minLength = password.length >= 8;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);

    return minLength && hasLetter && hasNumber;
  }
}

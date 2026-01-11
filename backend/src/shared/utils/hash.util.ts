import * as bcrypt from 'bcrypt';

export class HashUtil {
  static readonly saltRounds = 10;

  static async hash(data: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.saltRounds);
    return await bcrypt.hash(data, salt);
  }

  static async compare(data: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(data, hash);
  }
}
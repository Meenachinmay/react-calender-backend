import * as bcrypt from 'bcryptjs';

export async function hashPassword(rawPassword: string) {
  const salt = await bcrypt.genSalt();
  return bcrypt.hash(rawPassword, salt);
}

export async function compareHash(
  rawPassword: string,
  hashedPassword: string,
): Promise<boolean> {
  const result = await bcrypt.compare(rawPassword, hashedPassword);
  return result;
}

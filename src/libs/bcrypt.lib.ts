import bcrypt from "bcryptjs";

export class BcryptLib {
  public static hashPassword = async (password: string): Promise<string> => {
    const rounds: number = 10;
    const salt: string = await bcrypt.genSalt(rounds);
    const hash: string = await bcrypt.hash(password, salt);
    return hash;
  };

  public static comparePassword = async (
    inputPassword: string,
    userPassword: string
  ): Promise<boolean> => {
    return await bcrypt.compare(inputPassword, userPassword);
  };
}

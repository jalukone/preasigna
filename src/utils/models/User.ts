export interface IUser {
  email: string;
  name: string;
}

export class User implements IUser {
  constructor(public email: string, public name: string) {}
}

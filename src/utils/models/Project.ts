export interface IProject {
  name: string;
  id: string;
}

export class Project implements IProject {
  constructor(public name: string, public id: string) {}
}

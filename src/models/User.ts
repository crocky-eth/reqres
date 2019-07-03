interface IUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

interface IData {
  data: IUser;
}

export {
  IUser, IData
}
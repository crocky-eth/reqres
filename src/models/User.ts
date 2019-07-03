interface IUser {
  id: number
  email: string
  first_name: string
  last_name: string
  avatar: string
}

interface IData {
  data: IUser
}

interface IPage {
  last_page: number
  total_pages: number
  users?: IUser[]
}

interface IPageUsers {
  page: number
  per_page: number
  total: number
  total_pages: number
  data: IUser[]
}

class Users implements IPage {
  last_page: number
  total_pages: number
  users: IUser[]

  constructor({ last_page, total_pages, users }: IPage) {
    this.last_page = last_page || 1
    this.total_pages = total_pages || 1
    this.users = users || []
  }

  public addUsers(users: IUser[]) {
    users.forEach((user: IUser) => {
      if (!this.users.find(({ id }: IUser) => id === user.id)) {
        this.users.push(user)
      }
    })
    return this.users
  }

  public getJSON(): object {
    const {
      last_page,
      total_pages,
      users
    } = this
    return {
      last_page,
      total_pages,
      users
    }
  }
}

export {
  IUser,
  IData,
  IPageUsers,
  Users
}
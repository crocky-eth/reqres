import cron from 'node-cron'
import fs from 'fs'
import axios from 'axios'

import { IPageUsers, Users } from './models'

function getConfig(): Users {
  const dirPath = 'users'
  let exists = fs.existsSync(dirPath)
  if (!exists) {
    fs.mkdirSync(dirPath)
  }
  const filePath = dirPath + '/config.json'
  exists = fs.existsSync(filePath)
  if (!exists) {
    return new Users({
      last_page: 1,
      total_pages: 2,
    })
  }
  return new Users(JSON.parse(fs.readFileSync('users/config.json').toString()))
}

cron.schedule('* * * * * *', () => {
  const config: Users = getConfig()
  const { last_page, total_pages } = config
  if (last_page <= total_pages) {
    axios.get(`https://reqres.in/api/users?page=${last_page}`)
      .then(resp => resp.data)
      .then(({ total_pages, data }: IPageUsers) => {
        config.total_pages = total_pages
        config.last_page += 1
        config.addUsers(data)
        fs.writeFileSync('./users/config.json', JSON.stringify(config.getJSON()))
        console.log(`Fetch page ${last_page} done`);
      }).catch(err => {
        console.log(`Fetch page ${last_page} failed`);
      })
  } else {
    console.log(`No more users`);
  }
})
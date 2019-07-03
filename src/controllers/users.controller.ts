import axios from 'axios'
import fs from 'fs'
import https from 'https'
import {
  Response, Controller,
  Get, Post, Put, Delete,
  Params, Body, Query,
} from '@decorators/express'

@Controller('/api/users')
class UsersController {
  @Get('/:id')
  async getUser(@Response() res: any, @Params('id') id: string) {
    axios.get(`https://reqres.in/api/users/${id}`)
      .then(resp => res.send({
        success: true,
        data: resp.data
      })).catch(err => {
        this.errorHandler(res, 'No Data with provided id')
      })
  }

  @Get('/:id/avatar')
  async getUserAvatar(@Response() res: any, @Params('id') id: string) {
    try {
      const { data: { data: { avatar } } } = await axios.get(`https://reqres.in/api/users/${id}`)
      const avatarExt = getExt(avatar)
      const filePath = `./avatars/${id}.${avatarExt}`
      const exists = fs.existsSync(filePath)
      if (exists) {
        res.send({
          success: true,
          data: getBase64(filePath)
        })
      } else {
        const file = fs.createWriteStream(filePath)
        https.get(avatar, resp => {
          resp.pipe(file)
          file.on('finish', () => {
            file.close()
            res.send({
              success: true,
              data: getBase64(filePath)
            })
          })
        })
      }
    } catch (e) {
      this.errorHandler(res, 'No Data with provided id')
    }
  }

  @Delete('/:id/avatar')
  async deleteUser(@Response() res: any, @Params('id') id: string) {
    try {
      const { data: { data: { avatar } } } = await axios.get(`https://reqres.in/api/users/${id}`)
      const avatarExt = getExt(avatar)
      const filePath = `./avatars/${id}.${avatarExt}`
      fs.exists(filePath, exists => {
        if (exists) {
          fs.unlinkSync(filePath);
          res.send({
            success: true,
            data: filePath
          })
        } else {
          res.send({
            success: false,
            message: 'No images saved with that user id'
          })
        }
      })
    } catch (e) {
      this.errorHandler(res, 'No Data with provided id')
    }
  }

  errorHandler(@Response() res: any, message: string) {
    res.status(403).send({
      success: false,
      message,
    })
  }
}

function getBase64(filePath: string) {
  const data = fs.readFileSync(filePath)
  return data.toString('base64')
}

function getExt(str: string) {
  const ss = str.split('.')
  return ss[ss.length - 1]
}

export default UsersController
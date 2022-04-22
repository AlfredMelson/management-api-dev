import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import * as trpc from '@trpc/server'
import users from '../model/users.json'
import { v4 as uuidv4 } from 'uuid'
import fsPromises from 'fs/promises'
import path from 'path'
import { IUser } from '../model/users'

const userDB = {
  allUsers: users,
  setAllUsers: function (data: any) {
    this.allUsers = data
  }
}

export const userRouter = trpc
  .router()

  // read all users
  .query('getAll', {
    resolve() {
      return userDB.allUsers
    }
  })

  // create user
  .mutation('add', {
    input: z.object({
      userId: z.string(),
      firstname: z.string(),
      lastname: z.string(),
      email: z.string(),
      street: z.string(),
      city: z.string(),
      country: z.string()
    }),
    async resolve({ input }: Record<string, any>) {
      userDB.setAllUsers([...userDB.allUsers, input])
      // write the new user to the database
      fsPromises.writeFile(
        // navigate from the current directory into the model directory
        path.join(__dirname, '..', 'model', 'users.json'),
        // specify the data to be written
        JSON.stringify(userDB.allUsers)
      )
      return { user: input }
    }
  })

  // edit user
  .mutation('edit', {
    input: z.object({
      userId: z.string(),
      firstname: z.string(),
      lastname: z.string(),
      email: z.string(),
      street: z.string(),
      city: z.string(),
      country: z.string()
    }),
    async resolve({ input }) {
      // destructure the request
      const { userId } = input

      // check for user(id) exists in the database
      const foundUser = userDB.allUsers.find((user: IUser) => user.userId === userId)

      // send status 401: 'unauthorized; response means unauthenticated' if no duplicate found
      if (!foundUser) return { status: 401 }

      // write user list minus found useroyee
      try {
        // create an array of the other users that are not the current user
        const otherusers = userDB.allUsers.filter((user: IUser) => user.userId !== userId)

        // pass in other users to setusers with the updated user
        userDB.setAllUsers([...otherusers, input])

        // write the users to the database
        fsPromises.writeFile(
          // navigate from the current directory into the model directory
          path.join(__dirname, '..', 'model', 'users.json'),
          // specify the data to be written
          JSON.stringify(userDB.allUsers)
        )
        // send status 201: 'request succeeded, and user was updated as a result'
        return input
      } catch (err) {
        console.log(err)
      }
    }
  })

  // delete user
  .mutation('delete', {
    input: z.object({
      userId: z.string()
    }),
    async resolve({ input }) {
      // destructure the request
      const { userId } = input

      // check for user(id) exists in the database
      const founduser = userDB.allUsers.find((user: IUser) => user.userId === userId)

      // send status 401: 'unauthorized; response means unauthenticated' if no duplicate found
      if (!founduser) return { status: 401 }

      // write user list minus found useroyee
      try {
        // create an array of the other users that are not the current user
        const otherusers = userDB.allUsers.filter((user: IUser) => user.userId !== userId)

        // pass in other useroyees to setusers without the deleted useroyee
        userDB.setAllUsers([...otherusers])

        // write the new user to the database
        await fsPromises.writeFile(
          // navigate from the current directory up and into the model directory, to useroyees.json
          path.join(__dirname, '..', 'model', 'users.json'),
          // specify the data to be written
          JSON.stringify(userDB.allUsers)
        )

        // send status 201: 'request succeeded, and a new resource was updated as a result'
        // return { success: `User with id: ${deletionId} has been deleted.` }
        return input
      } catch (err) {
        console.log(err)
      }
    }
  })

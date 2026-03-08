import { beforeAll, afterAll, afterEach } from 'vitest'
import prisma from '../src/utils/prisma.js'

beforeAll(async () => {
  // Connect to test database
  await prisma.$connect()
})

afterEach(async () => {
  // Clean up tables between tests — add your models here
  // await prisma.user.deleteMany()
})

afterAll(async () => {
  await prisma.$disconnect()
})

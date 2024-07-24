import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

import { newId } from '../src/utils/new-id'

const prisma = new PrismaClient()

async function seed() {
  await prisma.organization.deleteMany()
  await prisma.user.deleteMany()

  const passwordHash = await hash('123456', 6)

  const user1 = await prisma.user.create({
    data: {
      id: newId('user'),
      name: 'John Doe',
      email: 'john@snipshare.co',
      verified: true,
      avatarUrl: 'https://github.com/joaopcm.png',
      passwordHash,
    },
  })

  const user2 = await prisma.user.create({
    data: {
      id: newId('user'),
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      verified: true,
      avatarUrl: faker.image.avatarGitHub(),
      passwordHash,
    },
  })

  const user3 = await prisma.user.create({
    data: {
      id: newId('user'),
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      verified: true,
      avatarUrl: faker.image.avatarGitHub(),
      passwordHash,
    },
  })

  await prisma.organization.create({
    data: {
      id: newId('organization'),
      name: 'Snipshare Inc (Admin)',
      domain: 'snipshare.co',
      slug: 'snipshare-admin',
      avatarUrl: faker.image.avatarGitHub(),
      shouldAttachUsersByDomain: true,
      ownerId: user1.id,
      projects: {
        createMany: {
          data: [
            {
              id: newId('project'),
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([
                user1.id,
                user2.id,
                user3.id,
              ]),
            },
            {
              id: newId('project'),
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([
                user1.id,
                user2.id,
                user3.id,
              ]),
            },
            {
              id: newId('project'),
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([
                user1.id,
                user2.id,
                user3.id,
              ]),
            },
          ],
        },
      },
      memberships: {
        createMany: {
          data: [
            {
              id: newId('membership'),
              userId: user1.id,
              role: 'ADMIN',
            },
            {
              id: newId('membership'),
              userId: user2.id,
              role: 'MEMBER',
            },
            {
              id: newId('membership'),
              userId: user3.id,
              role: 'MEMBER',
            },
          ],
        },
      },
    },
  })

  await prisma.organization.create({
    data: {
      id: newId('organization'),
      name: 'Snipshare Inc (Member)',
      slug: 'snipshare-member',
      avatarUrl: faker.image.avatarGitHub(),
      ownerId: user1.id,
      projects: {
        createMany: {
          data: [
            {
              id: newId('project'),
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([
                user1.id,
                user2.id,
                user3.id,
              ]),
            },
            {
              id: newId('project'),
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([
                user1.id,
                user2.id,
                user3.id,
              ]),
            },
            {
              id: newId('project'),
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([
                user1.id,
                user2.id,
                user3.id,
              ]),
            },
          ],
        },
      },
      memberships: {
        createMany: {
          data: [
            {
              id: newId('membership'),
              userId: user1.id,
              role: 'MEMBER',
            },
            {
              id: newId('membership'),
              userId: user2.id,
              role: 'ADMIN',
            },
            {
              id: newId('membership'),
              userId: user3.id,
              role: 'MEMBER',
            },
          ],
        },
      },
    },
  })

  await prisma.organization.create({
    data: {
      id: newId('organization'),
      name: 'Snipshare Inc (Billing)',
      slug: 'snipshare-billing',
      avatarUrl: faker.image.avatarGitHub(),
      ownerId: user1.id,
      projects: {
        createMany: {
          data: [
            {
              id: newId('project'),
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([
                user1.id,
                user2.id,
                user3.id,
              ]),
            },
            {
              id: newId('project'),
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([
                user1.id,
                user2.id,
                user3.id,
              ]),
            },
            {
              id: newId('project'),
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([
                user1.id,
                user2.id,
                user3.id,
              ]),
            },
          ],
        },
      },
      memberships: {
        createMany: {
          data: [
            {
              id: newId('membership'),
              userId: user1.id,
              role: 'BILLING',
            },
            {
              id: newId('membership'),
              userId: user2.id,
              role: 'ADMIN',
            },
            {
              id: newId('membership'),
              userId: user3.id,
              role: 'MEMBER',
            },
          ],
        },
      },
    },
  })
}

seed().then(() => {
  console.log('Database seeded!')
})

# Socket Chat

This Turbo repo contains both the client and server components for the socket chat application. The client is a basic UI written in Next.js with shadcn components and deployed on Vercel. The backend is a simple Socket IO server which handles bidirectional communication and is deployed on a DigitalOcean droplet. The database is deployed on NeonDB and the app is using Prisma ORM to communicate with the DB. The app uses next-auth for authentication.



https://github.com/user-attachments/assets/d00e1407-673c-42bf-9b08-dda3056809ac



## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `socket-server`: a socket.io backend server
- `web`: another [Next.js](https://nextjs.org/) app
- `@repo/db`: a prisma client package to interact with the database
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Build

To build all apps and packages, run the following command:

```
cd my-turborepo
yarn build
```

### Develop

To develop all apps and packages, run the following command:

```
cd my-turborepo
yarn dev
```

### Technologies used

- Nextjs
- Shadcn
- Socket.io
- PrismaORM
- Postgres

# personal-expense-log-server

## [Live](https://personal-expense-log-server.onrender.com/)

## Tech Stack
- Typescript
- PostgreSQL
- Prisma
- Express
- Postgres sessions

## Database Schema
![image](https://user-images.githubusercontent.com/91829843/198884630-ce56f368-09d8-46ec-bd1e-c156106f27a8.png)

## API Routes

### Auth Routes
- `/me`
- `/login`
- `/logout`
- `/register`

### Category Routes
- `/category`
- `/categories`
- `/categories/sum`
- `/category/delete/:categoryId`

### Transaction Routes
- `/transaction`
- `/transactions`
- `/transaction/delete/:transactionId`

### User Routes
- `/updateprofile`
- `/updateprofile/password`
- `/userprofile/delete`


## Scripts

```sh
> yarn build ### builds and compiles down to js
> yarn watch ### builds in dev mode with watch
> yarn start ### starts the server
> yarn dev ### starts the server in dev mode with watch mode on
> yarn start:tsnode ### starts the server with the ts-node
> yarn prisma:generate ### generates the sql migration file
> yarn gen-env ### generates .env.example file and generates the types for the environment variables
```

## How to run on your machine

```sh
> git clone https://github.com/0xHecker/personal-expense-log-server.git
> cd personal-expense-log-server
```

- Have your postgres database up and running
- Create .env file and setup your env variables


```sh
DATABASE_URL=    ### your postgres connection url 
PORT=            ### port you want the server to run on
NODE_ENV=        ### production | dev
CORS_ORIGIN=     ### your client url
SECRET=          ### express session secret
```

run these commands

```sh
> yarn
> yarn watch
> yarn prisma:generate
```









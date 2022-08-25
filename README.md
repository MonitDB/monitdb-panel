# MonitDB Panel

## Docker

In your terminal, run the below command to start the project using Docker:

`docker-compose up --build`

After that, just keep using `docker-compose up` to run the project or press the play button in your Docker Container.

## Project stack:

- React + [NextJS](https://nextjs.org)
- Lint (Eslint and Prettier)
- Precommit Lints

## IDE Setup

To maintain code quality and always have a standard across all of the team's
project has rules defined for javascript and css / scss. We use the Eslint /
Prettier for Javascript and Stylelint for SCSS. It is necessary to integration
of these rules with your favorite IDE. We recommend using Visual Studio Code
with the following plugins:

| Plugin   | README                                                                                     |
| -------- | ------------------------------------------------------------------------------------------ |
| ESlint   | [check plugin](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) |
| Prettier | [check plugin](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) |

## Pre-commit

Before running git commit, the rules of ESLint and Stylelint are executed. If
there is an error or some non-default code of the site will generate an error
and you will not be able to commit.

## Frontend

This project is bootstrapped with
[`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

### Getting Started

First, duplicate `.env.example` file, rename for `.env` and change the env
variables.

Install all the dependencies

```bash
npm install
```

then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the
result.

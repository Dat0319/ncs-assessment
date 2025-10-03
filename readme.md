# Base typescript nodejs

## Architect

![Architect](doc/architect_ncs-assessment.png 'Architect')

## Summary note

I use node 22.17.1, pnpm to install libs. docker compose to create database mysql, redis to cache.

Database to test auto create in data-seeder.ts

Host url: https://api.johnremotedev.com/api-docs

Postman collection: ./doc/postman.json

- when call api in postman
- The first call Api "0. user login" to get accessToken and auto save to environment of collection
- the second you can check other api
- finnally you can change enviroment and auth of collection setting.

Unit test: In this case i use unit test for "services layer" in "modules"(foulder tests base for end to end not use)

Security and permission: i check in auth.middleware and permission.middleware for check role permission of user and permission of user with api route.

### Run project

Run docker compose to create mysql + redis + ... container

```shell
# setup environments
docker-compose up -d

# start in local
yarn start

# run uni test
yarn test

```

```shell
# stop services
docker-compose down -v

# update global libs if you have error
# yarn global add gulp-cli
# yarn global add apidoc-swagger
```

## Features

- Error handling
- Database: mysql, typeORM/sequelizeORM
- Translate
- Logger: winston/morgan
- Dockerfile
- API docs: localhost:8080/api-docs
- Api flow: route -> controller -> service -> repository -> schema

# Structure

<hr/>
# Node Boilerplate

Node boilerplate is a standard project template based on NodeJS language, used init for internal projects.

## 1. Technical overview

### a. _Technical support_

- Technical programming:
  - _Language_: **NodeJS (>= 12, version: 22.17.1), Typescript (>=3)**
  - _Framework_: **ExpressJS**
  - _Task-runner_: **Gulp**
  - _Testing_: **Mocha/Chai & Suppertest**
  - Another:
    - Document: ApiDocJS + browser-sync support
    - Generator component: plop
    - Lint: ESLint & Prettier format support
- Operation support:
  - _Containerize_: dockerrize support
  - _Orchestration_: **K8S**
  - _CI/CD_: Bitbucket pipeline, GitlabCI & CircleCI example

### b. _Structure base_

```js
├───.docker
│   └───nginx
├───.husky
│   └───_
├───.vscode
├───deploy
│   └───templates
├───deployment
│   └───k8s
│       └───templates
├───doc
├───generators
│   └───templates
├───k8s
│   └───templates
├───logs
├───src
│   ├───api-docs
│   ├───common
│   │   ├───consts
│   │   ├───interfaces
│   │   ├───middlewares
│   │   └───validations
│   ├───configs
│   │   ├───databases
│   │   ├───environments
│   │   └───locales
│   │       └───en
│   ├───external-services
│   │   └───mail
│   ├───libs
│   │   ├───@types
│   │   │   └───express
│   │   ├───errors
│   │   ├───extensions
│   │   ├───interfaces
│   │   └───router
│   ├───migrations
│   ├───modules
│   │   ├───admin
│   │   ├───auth
│   │   ├───externals
│   │   │   └───cache-manager
│   │   ├───health
│   │   ├───loyalty
│   │   ├───loyalty-point
│   │   ├───order
│   │   ├───order-item
│   │   ├───order-item-attribute
│   │   ├───products
│   │   │   ├───product
│   │   │   └───product-attribute
│   │   ├───search
│   │   ├───upload
│   │   └───user
│   │       └───entities
│   └───utils
└───tests // for end to end testing
```

### c. _Dependency_

```json
  "dependencies": {
    "async": "^2.6.0",
    "atob": "^2.1.2",
    "bcrypt": "^3.0.6",
    "bluebird": "^3.5.1",
    "body-parser": "^1.18.2",
    "btoa": "^1.2.1",
    "camelcase-keys": "^6.2.2",
    "chalk": "2.3.0",
    "compression": "^1.7.2",
    "cors": "^2.8.4",
    "cron": "^1.7.2",
    "debug": "^3.1.0",
    "dot-object": "^1.7.0",
    "express": "^4.16.4",
    "express-locale": "^2.0.0",
    "express-session-multiple": "^1.15.7",
    "express-unless": "^0.5.0",
    "express-validation": "^3.0.6",
    "express-validator": "^5.3.1",
    "firebase-admin": "^8.6.0",
    "glob": "^7.1.2",
    "helmet": "^3.12.0",
    "http-status-codes": "^2.1.4",
    "ioredis": "^4.14.0",
    "jsonwebtoken": "^8.2.0",
    "kue": "^0.11.6",
    "lodash": "^4.17.5",
    "mkdirp": "^0.5.1",
    "moment": "^2.21.0",
    "mongo-cursor-pagination": "^7.1.0",
    "mongoose": "5.4.2",
    "morgan": "^1.9.0",
    "multer": "^1.4.1",
    "node-polyglot": "^2.4.0",
    "nodemailer": "^6.3.0",
    "numeral": "^2.0.6",
    "object-mapper": "^5.0.0",
    "request": "^2.87.0",
    "request-promise": "^4.2.2",
    "signale": "^1.3.0",
    "simple-encryptor": "^1.3.0",
    "snakecase-keys": "^3.2.0",
    "socket.io": "^2.3.0",
    "twitter": "^1.7.1",
    "validator": "^11.0.0",
    "winston": "2.4.3",
    "winston-graylog2": "^2.1.2"
  },
  "devDependencies": {
    "@types/async": "^2.0.48",
    "@types/bcrypt": "^3.0.0",
    "@types/bluebird": "^3.5.33",
    "@types/body-parser": "^1.16.8",
    "@types/chai": "^4.1.7",
    "@types/chai-json-schema": "^1.4.4",
    "@types/chalk": "^2.2.0",
    "@types/compression": "0.0.36",
    "@types/cors": "^2.8.3",
    "@types/cron": "^1.7.1",
    "@types/debug": "^0.0.30",
    "@types/dot-object": "^1.5.0",
    "@types/express": "^4.16.1",
    "@types/express-locale": "^2.0.0",
    "@types/express-unless": "^0.0.32",
    "@types/glob": "^5.0.35",
    "@types/googlemaps": "^3.30.9",
    "@types/helmet": "^0.0.37",
    "@types/http-status-codes": "^1.2.0",
    "@types/ioredis": "^3.2.13",
    "@types/jsonwebtoken": "^7.2.6",
    "@types/kue": "^0.11.9",
    "@types/lodash": "^4.14.105",
    "@types/mkdirp": "^0.5.2",
    "@types/mocha": "^5.2.6",
    "@types/moment": "^2.13.0",
    "@types/mongoose": "^5.10.1",
    "@types/morgan": "^1.9.2",
    "@types/multer": "^1.4.4",
    "@types/multer-s3": "^2.7.6",
    "@types/node-polyglot": "^2.4.1",
    "@types/nodemailer": "^4.6.8",
    "@types/numeral": "^0.0.22",
    "@types/request-promise": "^4.1.41",
    "@types/signale": "^1.2.0",
    "@types/socket.io": "^2.1.4",
    "@types/supertest": "^2.0.8",
    "@types/uuid": "^3.4.5",
    "@types/validator": "^10.11.1",
    "@types/winston": "2.3.9",
    "@typescript-eslint/eslint-plugin": "^4.8.1",
    "@typescript-eslint/parser": "^4.8.1",
    "browser-sync": "^2.26.13",
    "chai": "^4.2.0",
    "chai-json-schema": "^1.5.0",
    "chai-shallow-deep-equal": "^1.4.6",
    "cross-env": "^7.0.2",
    "eslint": "^7.13.0",
    "eslint-config-prettier": "^6.15.0",
    "eslint-watch": "^7.0.0",
    "gulp": "^4.0.2",
    "gulp-apidoc": "^0.2.8",
    "gulp-shell": "^0.6.5",
    "gulp-util": "^3.0.8",
    "lite-server": "^2.4.0",
    "mocha": "^6.0.2",
    "mocha.parallel": "^0.15.6",
    "mochawesome": "^3.1.1",
    "nodemon": "^1.17.2",
    "nyc": "^13.3.0",
    "plop": "^2.7.4",
    "pre-commit": "^1.2.2",
    "prettier": "^2.1.2",
    "run-sequence": "^2.2.1",
    "supertest": "^4.0.2",
    "ts-node": "^6.1.2",
    "tslint": "^5.10.0",
    "typescript": "3.5.1",
    "yargs": "^11.0.0"
  }
```

## 2. How to running

### a. **How to running & build**

You can launch applications with many different environment modes like:

- **Local**: running with local environment. Application mode running in port: **8181**

  ```shell
  # running: yarn start or npm start
  # build: yarn buildLocal or npm run buildLocal
  ```

- **Test** Running with unit testing

  ```shell
  # e2e test
  # yarn test or npm run test
  # test coverage
  # yarn test:cov or npm run test:cov
  ```

- **Document**: In local mode, when launching the application. You can only test common api. To be able to develop a swagger document with the application you are running or use the following command:

  ```shell
  # yarn global add gulp-cli
  # yarn global add apidoc-swagger
  # link apidoc: npm link apidoc-swagger

  # yarn document
  ```

### b. **Generators**

```Shell
# yarn generate or npm run generate
```

Allows you to auto-generate boilerplate code for common parts of your
application. You can
also run `npm run generate` to skip the first selection.

### c. **How to build with docker image**

You need to select the corresponding build environment for docker image:

- **Staging** Application build for staging environment. Dockerfile select refer _**.docker/staging.dockerfile**_

  ```shell
  cd script && ./staging.sh
  ```

- **Production** Application build for production environment. Dockerfile select refer _**.docker/production.dockerfile**_

  ```shell
  cd script && ./production.sh
  ```

In this case I use docker compose config with pm2 to run in VPS

## 3. Release change

### a. Version release

- Version 1.0 (Release 2019):
  - Init base structure project
- Version 1.1 (Release first 2019)
  - Improve
- Version 2.0 list change:
  - Lib (in src/libs) change all common variable is cammelCase
  - Multiple language support (using polyglot from airbnb)
  - Generator api component support
  - Change response common
  - Moving spec test to inline component
  - Upgrade gulp V4 is compatibility version node >= 12
  - Lint validation: include eslint/prettier (apply new eslint replace tslint)

### b. Improvement

- DevOps:
  - Push CI/CD option config: gitlab, bitbucket, circleCI config
  - Config helm chart
  - Integration support:
    - Artifactory:
    - Code quality/vulnerability: sonarqube configuration/ snyk

License

---

MIT

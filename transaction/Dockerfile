FROM node:20-alpine3.20 AS build

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn && yarn cache clean

COPY . .
RUN yarn run build

FROM node:20-alpine3.20

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/package.json ./package.json
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules

EXPOSE 3001

CMD [ "yarn", "start" ]
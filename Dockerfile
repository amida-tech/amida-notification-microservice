FROM node:8.16.0-alpine as builder

WORKDIR /app/
COPY . /app/

RUN yarn install --pure-lockfile
RUN yarn build
RUN yarn install --production --frozen-lockfile

FROM node:8.16.0-alpine

WORKDIR /app/

COPY --from=builder /app/ /app/

EXPOSE 4003

CMD ["yarn", "serve"]

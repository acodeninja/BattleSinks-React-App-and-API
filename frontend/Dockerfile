FROM node:12-alpine
RUN apk --no-cache add git make
RUN npm i -g yarn

ADD . /app
WORKDIR /app

RUN yarn install

CMD make serve

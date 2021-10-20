FROM node:17
RUN mkdir /usr/src/app
WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH
ENV TZ="Europe/Budapest"
COPY package.json /usr/src/app/package.json
COPY .env /usr/src/app/.env
COPY yarn.lock /usr/src/app/yarn.lock
RUN yarn install
COPY . /usr/src/app
RUN yarn build:prod
CMD yarn serve

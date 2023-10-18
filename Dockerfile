FROM node:14

RUN mkdir -p /usr/src/app
RUN mkdir -p /usr/src/app/logs
RUN mkdir -p /usr/src/app/appConfigs
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install

COPY . /usr/src/app
EXPOSE 3000
CMD [ "npm", "run", "start-gendoc:dev" ]
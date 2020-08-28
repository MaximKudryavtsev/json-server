FROM node:12-alpine

RUN echo "fs.inotify.max_user_instances=524288" >> /etc/sysctl.conf && sysctl -p

WORKDIR /usr/src/app

COPY package.json .
COPY package-lock.json .

RUN npm i

COPY . .

CMD ["npm", "run", "start"]

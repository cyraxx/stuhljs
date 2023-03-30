FROM node:lts
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install --prod
COPY . .
EXPOSE 3000
CMD [ "node", "stuhl.js" ]


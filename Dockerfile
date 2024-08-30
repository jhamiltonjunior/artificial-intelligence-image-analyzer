FROM node:20.16

WORKDIR /usr/src/app

COPY package.json ./
COPY tsconfig.json ./
COPY scripts/wait-for-it.sh ./scripts/

RUN npm install

COPY . .

RUN npm run build

CMD ["npm", "start"]

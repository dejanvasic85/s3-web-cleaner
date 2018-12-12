FROM mhart/alpine-node:10

WORKDIR /app

COPY . .

CMD ["node", "index.js"]
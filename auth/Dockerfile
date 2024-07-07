FROM node:alpine

WORKDIR /app
COPY package.json .
RUN npm install --omit=dev
COPY . .
RUN npx prisma generate

CMD ["npm", "start"]
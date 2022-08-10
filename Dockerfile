FROM node:16

# создание директории приложения
WORKDIR /app

COPY package*.json /app

RUN npm install

# копируем исходный код
COPY . .



EXPOSE 4444
CMD [ "node", "index.js" ]
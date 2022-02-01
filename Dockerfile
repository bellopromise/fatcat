FROM node:16.13.2



COPY ./ ./

RUN npm install

EXPOSE 4002

CMD ["node", "server.js"]
FROM node:16-alpine
USER node
WORKDIR /home/node
COPY --chown=node:node . /home/node
RUN npm install
CMD npm start

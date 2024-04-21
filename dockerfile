FROM node:21-alpine3.18

WORKDIR /app

COPY . .
RUN yarn install --frozen-lockfile --production && yarn cache clean
RUN yarn build

EXPOSE 3000

# ENTRYPOINT ["sh", "./entrypoint.sh"]
CMD ["node", "/app/dist/index.mjs"]

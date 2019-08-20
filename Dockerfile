# ---- Base Image ----
FROM node:12-alpine as base

WORKDIR /opt/ccd-definition-processor

COPY package.json yarn.lock ./

RUN yarn install --production \
    && yarn cache clean

# ---- Runtime Image ----
FROM base as runtime

COPY . .

ENTRYPOINT [ "yarn", "--silent" ]
CMD [ "json2xlsx" ]

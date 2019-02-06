# ---- Base Image ----
FROM hmcts.azurecr.io/hmcts/base/node/alpine-lts-10 as base
COPY package.json yarn.lock ./

RUN yarn install --production \
  && yarn cache clean

# ---- Runtime Image ----
FROM base as runtime
COPY . .
ENTRYPOINT [ "yarn", "--silent" ]
CMD [ "json2xlsx" ]

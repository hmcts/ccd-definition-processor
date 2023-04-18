# ---- Base Image ----
FROM hmctspublic.azurecr.io/base/node:16-alpine as base


# ---- Build image ---- #
FROM base as build
USER root
RUN corepack enable

USER hmcts
COPY --chown=hmcts:hmcts . .
RUN yarn install && yarn cache clean

# ---- Runtime Image ----
FROM build as runtime

COPY . .

CMD [ "yarn", "run", "--silent","json2xlsx" ]

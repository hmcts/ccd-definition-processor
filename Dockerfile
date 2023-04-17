# ---- Base Image ----
FROM hmctspublic.azurecr.io/base/node:16-alpine as base


# ---- Build image ---- #
FROM base as build
USER root
RUN corepack enable

COPY --chown=hmcts:hmcts . .
RUN yarn install && yarn cache clean

# ---- Runtime Image ----
FROM base as runtime

COPY . .

ENTRYPOINT [ "yarn", "--silent" ]
CMD [ "json2xlsx" ]

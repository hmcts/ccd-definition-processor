# ---- Base Image ----
FROM hmctspublic.azurecr.io/base/node:16-alpine as base


# ---- Build image ---- #
FROM base as build
USER root
RUN corepack enable
WORKDIR=/opt/ccd-definition-processor
USER hmcts

COPY --chown=hmcts:hmcts . .
RUN yarn install && yarn cache clean

# ---- Runtime Image ----
FROM build as runtime

COPY . .
USER root
RUN chmod -R 777 /tmp
ENTRYPOINT [ "yarn","run", "--silent" ]
CMD [ "json2xlsx" ]


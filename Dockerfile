# ---- Base Image ----
FROM hmctspublic.azurecr.io/base/node/stretch-slim-lts-10:10-stretch-slim as base
USER hmcts
COPY --chown=hmcts:hmcts package.json yarn.lock ./

RUN yarn install --production \
    && yarn cache clean

# ---- Runtime Image ----
FROM base as runtime

COPY . .

ENTRYPOINT [ "yarn", "--silent" ]
CMD [ "json2xlsx" ]

# ---- Base Image ----
FROM node:16-alpine as base

ENV APP_USER=hmcts \
  WORKDIR=/opt/ccd-definition-processor \
  UID=1001 \
  GID=1001

WORKDIR ${WORKDIR}

RUN addgroup -g $GID -S $APP_USER && \
    adduser -u $UID -S $APP_USER -G $APP_USER -s /bin/sh && \
    chown -R $APP_USER:$APP_USER ${WORKDIR}

USER ${APP_USER}

COPY --chown=${APP_USER}:${APP_USER} package.json yarn.lock ./

RUN yarn install --production \
    && yarn cache clean

# ---- Runtime Image ----
FROM base as runtime

COPY . .

ENTRYPOINT [ "yarn", "--silent" ]
CMD [ "json2xlsx" ]

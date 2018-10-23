FROM node:10-alpine

WORKDIR /opt/ccd-definition-processor

ADD . /opt/ccd-definition-processor/

RUN rm -rf node_modules \
    && yarn install --production \
    && yarn cache clean

ENTRYPOINT [ "yarn", "--silent" ]
CMD [ "json2xlsx" ]

FROM node:lts-alpine as Build-base
RUN apk add --no-cache git build-base
WORKDIR /app

FROM Build-base as Build-vendor-pre
COPY package.json /app/package.json
RUN node -pe '(d=`dependencies`,dd=`devDependencies`,p=`./package.json`,JSON.stringify({[d]:require(p)[d],[dd]:require(p)[dd]},null,2))' >pkg-build-deps.json

FROM Build-base as Runtime-vendor-build
COPY yarn.lock /app/yarn.lock
COPY --from=Build-vendor-pre /app/pkg-build-deps.json /app/package.json
RUN yarn install --production

FROM Build-base as Build-vendor-build
COPY yarn.lock /app/yarn.lock
COPY --from=Build-vendor-pre /app/pkg-build-deps.json /app/package.json
COPY --from=Runtime-vendor-build /app/node_modules /app/node_modules
RUN yarn install

FROM Build-base as Build
COPY --from=Build-vendor-build /app/node_modules /app/node_modules
COPY . /app
RUN yarn next build

FROM node:lts-alpine
COPY --from=Runtime-vendor-build /app/node_modules /app/node_modules
COPY --from=Build /app/.next /app/.next
COPY . /app
CMD [ "yarn", "docker:start" ]
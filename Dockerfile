FROM node:lts as Build-base
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
RUN yarn prisma migrate up -c --experimental
RUN yarn prisma generate
RUN yarn next build

FROM node:lts
COPY --from=Runtime-vendor-build /app/node_modules /app/node_modules
COPY --from=Build /app/.next /app/.next
COPY --from=Build /app/prisma/dev.db /app/prisma/dev.db
COPY . /app
WORKDIR /app
RUN yarn prisma generate
ENV \
  Addr=http://127.0.0.1:3000 \
  PORT=3000
CMD [ "yarn", "docker:start" ]
#FROM node:10.5 as build-stage

FROM node:11.6.0-alpine AS build-stage

COPY . /app

WORKDIR /app

RUN npm install

RUN npm run build --prod --output-path=./dist


#RUN ng build --prod --output-path=./dist

#FROM nginx:1.15

FROM nginx:1.15.8-alpine

COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=build-stage app/dist/metabol /app

EXPOSE 80


#FROM node:11.6.0-alpine AS builder
#COPY . ./test-application
#WORKDIR /test-application
#RUN npm i
#RUN $(npm bin)/ng build --prod

#FROM nginx:1.15.8-alpine

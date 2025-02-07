# Video streaming client
FROM node:20.9.0 AS client

WORKDIR /home/seadronix/client

COPY package*.json yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 5173

CMD ["yarn", "dev"]

# Video streaming server
FROM node:20.9.0 AS server

WORKDIR /home/seadronix/server

# install ffmpeg and yarn
RUN apt-get update && \
    apt-get install -y ffmpeg && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

COPY package*.json yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 8000

CMD ["yarn", "dev"]

FROM node:8
LABEL Description="This image runs riff-rtc which serves the pages to enable video chat w/ the Media Manager"

ARG REACT_APP_SERVER_TOKEN
ARG REACT_APP_SERVER_URL
ARG REACT_APP_SERVER_EMAIL
ARG REACT_APP_SERVER_PASSWORD
ARG REACT_APP_TRACK_FACE
ARG REACT_APP_DEBUG
ARG REACT_APP_SIGNALMASTER_URL
ARG PORT
ARG CONSUMER_KEY
ARG CONSUMER_SECRET
ARG SESSION_SECRET
ARG ROOM_MAP_URL
ARG CI
ARG NODE_ENV
ARG AUTH_ON

# set environment variables
ENV REACT_APP_SERVER_TOKEN=$REACT_APP_SERVER_TOKEN
ENV REACT_APP_SERVER_URL=$REACT_APP_SERVER_URL
ENV REACT_APP_SERVER_EMAIL=$REACT_APP_SERVER_EMAIL
ENV REACT_APP_SERVER_PASSWORD=$REACT_APP_SERVER_PASSWORD
ENV REACT_APP_TRACK_FACE=$REACT_APP_TRACK_FACE
ENV REACT_APP_DEBUG=$REACT_APP_DEBUG
ENV REACT_APP_SIGNALMASTER_URL=$REACT_APP_SIGNALMASTER_URL
ENV PORT=$PORT
ENV CONSUMER_KEY=$CONSUMER_KEY
ENV CONSUMER_SECRET=$CONSUMER_SECRET
ENV SESSION_SECRET=$SESSION_SECRET
ENV ROOM_MAP_URL=$ROOM_MAP_URL
ENV CI=$CI
ENV NODE_ENV=$NODE_ENV
ENV AUTH_ON=$AUTH_ON

# Modified bashrc which defines some aliases and an interactive prompt (for both root & node users)
COPY bashrc /root/.bashrc

# set the root password to password (I don't care that it's simple it's only for development
# this shouldn't exist in a production container
RUN echo "root:password" | chpasswd

RUN echo "$NODE_ENV"
RUN echo "$PORT"

# The node:8 npm v 5.6 has some issues, update it to 6.0
RUN npm install -g npm

WORKDIR /app
COPY . .
RUN npm install
RUN npm run-script build

# node images have a node user w/ UID 1000 (works well for me for now, but more thought may be needed later) -mjl
USER node
WORKDIR /app
COPY bashrc /home/node/.bashrc

EXPOSE 3001

RUN ls -al /app/

# riff-rtc repository working directory must be bound at /app and all dependent packages installed
CMD ["npm", "start"]
# ENTRYPOINT ["/bin/bash"]

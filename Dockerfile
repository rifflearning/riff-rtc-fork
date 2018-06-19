FROM node:8
LABEL Description="This image runs riff-rtc which serves the pages to enable video chat w/ the Media Manager"


ARG REACT_APP_DEBUG
ARG CI
ARG NODE_ENV
ARG DATASERVER_EMAIL
ARG DATASERVER_PASSWORD
ARG SESSION_SECRET
ARG CONSUMER_KEY
ARG CONSUMER_SECRET

ENV REACT_APP_DEBUG=$REACT_APP_DEBUG
ENV CI=$CI
ENV NODE_ENV=$NODE_ENV
ENV DATASERVER_EMAIL=$DATASERVER_EMAIL
ENV DATASERVER_PASSWORD=$DATASERVER_PASSWORD
ENV SESSION_SECRET=$SESSION_SECRET
ENV CONSUMER_KEY=$CONSUMER_SECRET
ENV CONSUMER_SECRET=$CONSUMER_SECRET



# Modified bashrc which defines some aliases and an interactive prompt (for both root & node users)
COPY bashrc /root/.bashrc

# set the root password to password (I don't care that it's simple it's only for development
# this shouldn't exist in a production container
RUN echo "root:password" | chpasswd

# The node:8 npm v 5.6 has some issues, update it to 6.0
RUN npm install -g npm

# copy and install dependencies separately so they cache
WORKDIR /app

COPY package.json .
RUN npm install

COPY . .
RUN npm install -g coffeescript
RUN npm run build

# node images have a node user w/ UID 1000 (works well for me for now, but more thought may be needed later) -mjl
USER node
WORKDIR /app
COPY bashrc /home/node/.bashrc

EXPOSE 3001

# riff-rtc repository working directory must be bound at /app and all dependent packages installed
CMD ["npm", "start"]
# ENTRYPOINT ["/bin/bash"]

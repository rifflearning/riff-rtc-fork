FROM node:8
LABEL Description="This image runs riff-rtc which serves the pages to enable video chat w/ the Media Manager"

# Modified bashrc which defines some aliases and an interactive prompt (for both root & node users)
COPY bashrc /root/.bashrc

# set the root password to password (I don't care that it's simple it's only for development
# this shouldn't exist in a production container
RUN echo "root:password" | chpasswd

# The node:8 npm v 5.6 has some issues, update it to 6.0
RUN npm install -g npm

# node images have a node user w/ UID 1000 (works well for me for now, but more thought may be needed later) -mjl
USER node
COPY bashrc /home/node/.bashrc

EXPOSE 3001

# riff-rtc repository working directory must be bound at /app and all dependent packages installed
VOLUME /app
WORKDIR /app
RUN ls -al
CMD ["npm", "start"]
# ENTRYPOINT ["/bin/bash"]


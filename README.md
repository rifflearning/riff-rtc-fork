riff-rtc
========

Riff video chat (using WebRTC) platform server and client

## Client ##

A single page application (SPA) implmented with React which provides the interface
for the Riff Learning communication tools and metrics.

The videoconferencing is build on top of [SimpleWebRTC][], and the initial design
and data analysis came from the MIT [Rhythm][] framework for
measuring conversation dynamics within teams.

## Server ##

The server exists to integrate configuration values into the client and serve the
various files the client consists of to the browser. It also supports integration
with LMSs via the LTI specification.

## Files and Folders ##

- public: client side public HTML / CSS
- src: client side javascript
- server: server side javascript
- config: configuration files (see [node-config][])
- webpack:
- docker:

## Installing and running ##

```sh
npm install
npm run build:prod
npm start
```

## Configuration ##

(section to be written)

## Docker container ##

(section to be written)


[SimpleWebRTC]: <https://github.com/andyet/SimpleWebRTC/> "SimpleWebRTC"
[Rhythm]: <https://rhythm.mit.edu> "MIT Rhythm"
[node-config]: <https://github.com/lorenwest/node-config#readme> "node-config readme"

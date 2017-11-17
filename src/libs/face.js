import {log} from './utils';
const Thumos = require('thumos');

export default function trackFace(app, user, roomname, videoId) {

  log("starting to track facial movement!");

  var faceEvents = new Thumos(videoId,'video-overlay', true);
  faceEvents.bind('faceMoving', function (data) {
    app.service('faces').create({
      'participant': user,
      'room': roomname,
      'timestamp': data.time.toISOString(),
      'x_array': data.xArray,
      'y_array': data.yArray,

    }).then(function (res) {
      log('face movement event is being emitted!!! ', res);
    }).catch(function (err) {
      console.log('ERROR: ', err);
    });
  });

}

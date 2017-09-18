const Thumos = require('thumos');
import {log} from './utils';

export default function trackFace(app, user, roomname, videoId) {

  log("starting to track facial movement!");

  var faceEvents = new Thumos(videoId,'videoOverlay', false);
  faceEvents.bind('faceMoving', function (data) {
    this.app.service('faces').create({
      'participant': user,
      'meeting': roomName,
      'timestamp': data.now.toISOString(),
      'start_time': data.start.toISOString(),
      'end_time': data.end.toISOString(),
      'face_delta': data.delta,
      'delta_array': data.array
    }).then(function (res) {
      log('face movement event is being emitted!!! ', res);
    }).catch(function (err) {
      log('ERROR: ', err);
    });
  });

}

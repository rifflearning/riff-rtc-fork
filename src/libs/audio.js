
export default function captureSpeakingEvent(server, userinfo) {
  /*
   * returns a function to consume speaking data + offload it to server,
   * closing over the server + userinfo args
   */
  return function(data) {
    console.log(userinfo.roomname);
    console.log(userinfo.username);
    server.service('utterances').create({
      'participant': userinfo.username,
      'meeting': userinfo.roomname,
      'startTime': data.start.toISOString(),
      'endTime': data.end.toISOString(),
      'token': userinfo.token
    }).then(function (res) {
      console.log('speaking event recorded!', res);
      var start = new Date(res['startTime']);
      var end = new Date(res['endTime']);
      var duration = end - start;
      console.log(duration);
    }).catch(function (err) {
      console.log('ERROR:', err)
    })
  }
}

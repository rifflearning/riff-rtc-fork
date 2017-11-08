function getUrlParam(sParam) {
  var sPageURL = decodeURIComponent(window.location.search.substring(1)),
      sURLVariables = sPageURL.split('&'),
      sParameterName,
      i;

  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split('=');

    if (sParameterName[0] === sParam) {
      return sParameterName[1] === undefined ? true : sParameterName[1];
    }
  }
};
function log() {
  if (process.env.REACT_APP_DEBUG == "true") {
    console.log.apply(console, arguments);
  }
};

export {
  getUrlParam,
  log
};

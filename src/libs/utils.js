export function getUrlParam(sParam) {
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

export function log() {
  if (window.client_config.react_app_debug == true) {
    console.log.apply(console, arguments);
  }
};

export const logger =
  {
    debug: window.client_config.react_app_debug ? console.log.bind(window.console) : () => {},
    info: console.log.bind(window.console),
    warn: console.warn.bind(window.console),
    error: console.error.bind(window.console),
  };

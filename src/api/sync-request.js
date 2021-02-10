let baseURL = '/backend';

let syncRequest = opts => {
  let xmlhttp = new XMLHttpRequest();
  xmlhttp.open(opts.method || "GET", baseURL + opts.url, false);
  xmlhttp.send(null);
  return JSON.parse(xmlhttp.responseText);
};

export default syncRequest

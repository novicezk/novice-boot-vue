let baseURL = process.env.BACKEND_URL;

let syncRequest = opts => {
  let xmlhttp = new XMLHttpRequest();
  xmlhttp.open(opts.method || "GET", baseURL + opts.url, false);
  xmlhttp.send(null);
  return JSON.parse(xmlhttp.responseText);
};

export default syncRequest

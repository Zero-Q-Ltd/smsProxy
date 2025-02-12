const https = require('https')
const http = require('http')

const PORT = process.env.PORT || 3000;

http.createServer(onRequest).listen(PORT);
console.log(PORT)
function onRequest(client_req, client_res) {
  const { headers, method, url } = client_req;
  let buffer = [];
  client_req.on('error', (err) => {
    console.error(err);
  }).on('data', (chunk) => {
    // console.log(JSON.parse(chunk))
    buffer.push(chunk);
  }).on('end', () => {
    let body
    if (buffer.length > 0) {
      body = JSON.parse(Buffer.concat(buffer).toString())
    }
    // At this point, we have the headers, method, url and body, and can now
    // do whatever we need to in order to respond to this request.
    try {
      delete headers["x-forwarded-for"]
      delete headers["x-forwarded-proto"]
      delete headers["host"]
    } catch{
      console.error("headers not present")
    }
    try {
      delete body.provider
    } catch{
      console.error("provider not present")
    }
    headers["content-length"] = JSON.stringify(body).length

    var options = {
      port: 443,
      path: url,
      method,
      headers,
      host: body.target,
    };
    console.log(options)
    console.log(JSON.stringify(body))

    var proxy = https.request(options, function (res) {
      client_res.writeHead(res.statusCode, res.headers)
      res.pipe(client_res, {
        end: true
      });
    });
    proxy.write(JSON.stringify(body))
    client_req.pipe(proxy, {
      end: true
    });
  });

}
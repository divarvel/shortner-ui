var static = require('node-static');
var http = require('http');
 
var file = new static.Server('./dist');

http.createServer(function (request, response) {
  if(request.url.indexOf('/api') === 0) {
    request.headers.host = 'cltdl.fr';
    const options = {
      hostname: 'cltdl.fr',
      method: request.method,
      path: request.url,
      headers: request.headers
    };
    console.log(options);
    const proxy_request = http.request(options, (proxy_response) => {
      proxy_response.on('data', function(chunk) {
        response.write(chunk, 'binary');
      });
      proxy_response.on('end', function() {
        response.end();
      });
      response.writeHead(proxy_response.statusCode, proxy_response.headers);
    });
    request.on('data', function(chunk) {
      proxy_request.write(chunk, 'binary');
    });
    request.on('end', function() {
      proxy_request.end();
    });
  } else {
    file.serve(request, response);
  }
}).listen(8080);

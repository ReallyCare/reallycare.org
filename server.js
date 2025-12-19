const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const csp = require('node-csp');
const port = 3003;

const map = {
  '.ico': 'image/x-icon',
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.doc': 'application/msword'
};

const options = {
  directives: {
    defaultSrc: ['self'],
    styleSrc: ['self', 'unpkg.com','maxcdn.bootstrapcdn.com','unsafe-inline','*.mailchimp.com'],
    imgSrc: ['self', 'upload.wikimedia.org', 'i.creativecommons.org', 'licensebuttons.net', '*.mailchimp.com', 'eep.io', 'www.digitalsocialcare.co.uk', 'cdn.asp.events'],
    fontSrc: ['self', 'maxcdn.bootstrapcdn.com', 'data:'],
    scriptSrc: ['self', 'cdnjs.cloudflare.com',  's3.amazonaws.com',  "'sha256-EnleShJ5nz6/ZrucBUUEd0F7UfsxD+KRCXfGE/Zrh0g='", 'reallycare.us20.list-manage.com']
  }
}

http.createServer(function (req, res) {
  console.log(`${req.method} ${req.url}`);

  // security headers
  csp.add(req, res, options);
  res.setHeader('Strict-Transport-Security', 'max-age=15768000');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Permissions-Policy', 'interest-cohort=()');
  res.setHeader('Referrer-Policy', 'no-referrer');

  // Handle dodgy privacy url in shipped apps (plait-mobile)
  if (req.url.indexOf('privacy.html') > -1) {
    req.url = req.url.slice(0,-5)+'/';
  }
  // parse URL
  const parsedUrl = url.parse(req.url);
  // extract URL path
  let pathname = `./public${parsedUrl.pathname}`;
  // don't let people get root access
  pathname = pathname.replace(/^(\.)+/, '.');
  // based on the URL path, extract the file extention. e.g. .js, .doc, ...
  const ext = path.parse(pathname).ext || '.html';
  // maps file extention to MIME typere

  fs.access(pathname, function (err) {
    if(err) {
      // if the file is not found, send 404.html
      res.statusCode = 404;
      pathname = './public/404.html';
    }

    // if is a directory search for index file matching the extention
    if (fs.statSync(pathname).isDirectory()) pathname += 'index' + ext;

    // read file from file system
    fs.readFile(pathname, function(err, data){
      if(err){
        res.statusCode = 500;
        res.end(`Error getting the file: ${err}.`);
      } else {
        // if the file is found, set Content-type and send data
        res.setHeader('Content-type', map[ext] || 'text/plain' );
        res.setHeader('Cache-Control', 'max-age=3600');
        res.end(data);
      }
    });
  });


}).listen(parseInt(port));

console.log(`Server listening on port ${port}`);

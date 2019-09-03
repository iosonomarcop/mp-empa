const express = require('express');
const path = require('path');
const open = require('open');
const mockData = require('./mockData');

const appRoot = '/app';
const buildFolderName = 'dist';
const homePagePath = 'home/index.html';

const app = express();

app.get("/api/info", function (req, res) {
  res.json({
    version: "1.0.0",
    timestamp: new Date()
  });
});

app.post("/api/login", function (req, res) {
  res.json({
    id: 1
  });
});

app.get("/api/users/:id", function (req, res) {
  res.json(mockData.users[+req.params["id"]]);
});

app.get("/api/users/:id/orders", function (req, res) {
  res.json(mockData.userOrders);
});

app.delete("/api/orders/:id", function (req, res) {
  res.json({
    orderId: +req.params["id"],
    status: "cancelled",
    order: mockData.orders[+req.params["id"]]
  });
});

function getStaticResourcePath(requestUrl) {
  if (requestUrl.startsWith(appRoot)) {
    return buildFolderName + '/' + requestUrl.substring(appRoot.length, requestUrl.length);
  }
  return buildFolderName + '/' + requestUrl;
}

const staticExt = [
  '.js',
  '.ico',
  '.css',
  '.png',
  '.jpg',
  '.woff2',
  '.woff',
  '.ttf',
  '.svg',
];

app.get('*', function (req, res) {
  if (staticExt.filter(function (ext) {
    return req.url.indexOf(ext) > 0;
  }).length > 0) {
    res.sendFile(path.resolve(getStaticResourcePath(req.url)));
  } else if (req.url === '/') {
    res.sendFile(path.resolve(homePagePath));
  } else if (req.url === '/app') {
    res.sendFile(path.resolve(buildFolderName + '/app.html'));
  } else {
    res.redirect('/app');
  }
});

app.listen(3000, () => {
  open('http://localhost:3000');
});

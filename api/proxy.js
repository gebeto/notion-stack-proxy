const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const API_NOTION = "https://api.notion.com"

function onRequest(preq, req) {
  const headers = preq.getHeaderNames();
  headers.forEach((header) => {
    if (header.startsWith('x-')) {
      preq.removeHeader(header);
    }
  })
}

function onResponse(pres) {
  pres.headers["Access-Control-Allow-Origin"] = "*";
}

const proxy = createProxyMiddleware({
  target: API_NOTION,
  changeOrigin: true,
  pathRewrite: {
    '^/notion-api': ''
  },
  toProxy: true,
  logLevel: 'debug',
  onProxyReq: onRequest,
  onProxyRes: onResponse
});

const corsFunc = cors({ origin: true });

module.exports = (req, res) => {
  let prefix = "/notion-api"
  if (!req.url.startsWith(prefix)) {
    return;
  }

  if (req.method == 'OPTIONS') {
    corsFunc(req, res);
    return;
  }

  proxy(req, res);
}

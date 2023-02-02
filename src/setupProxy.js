const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = (app) => {
    app.use(
        "/ws",
        createProxyMiddleware({ target: "http://52.79.108.23:8080/uostime-chat", ws: true })
    );
};
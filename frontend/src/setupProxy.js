const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/v2/local', // 프록시 경로 설정
        createProxyMiddleware({
            target: 'https://dapi.kakao.com', // 요청을 보낼 타겟 URL (Kakao API 서버)
            changeOrigin: true, // 원본 서버와 다른 도메인으로 요청할 수 있도록 설정
            pathRewrite: {
                '^/v2/local': '/v2/local', // 프록시 경로 리라이트
            },
        })
    );

    app.use(
        '/search-summary', // 프록시 경로 설정
        createProxyMiddleware({
            target: 'https://capstone.newdongjun.com/', // 요청을 보낼 타겟 URL
            changeOrigin: true, // 원본 서버와 다른 도메인으로 요청할 수 있도록 설정
            pathRewrite: {
                '^/search-summary': '/search-summary', // 프록시 경로 리라이트
            },
        })
    );
};

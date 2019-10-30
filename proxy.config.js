const proxy = [
    {
        context: '/jira',
        target: 'https://jiraproducao.totvs.com.br',
        changeOrigin: true,
        pathRewrite: {'^/jira' : ''}
    }

    ];
module.exports = proxy;
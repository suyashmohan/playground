const config = {
    db: {
        url: 'localhost',
        name: 'redditClone',
        getConnectionString: function () {
            return `mongodb://${this.url}/${this.name}`;
        }
    },
    secret: 'Kg)4g.56-t:W_%$8',
    tokenExpiry: '1d'
};

module.exports = config;

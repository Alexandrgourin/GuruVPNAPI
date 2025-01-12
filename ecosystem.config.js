module.exports = {
  apps: [{
    name: 'guru-vpn-api',
    script: 'dist/index.js',
    env: {
      NODE_ENV: 'production'
    }
  }]
};

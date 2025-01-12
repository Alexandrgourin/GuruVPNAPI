module.exports = {
  apps: [{
    name: 'guru-vpn-api-staging',
    script: 'dist/index.js',
    env: {
      NODE_ENV: 'staging',
      PORT: 3001 // Используем другой порт для staging
    }
  }]
};

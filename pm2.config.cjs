module.exports = {
  apps: [
    {
      name: 'famir-demo-console',
      script: 'dist/console/loaders/net.js',
      env: {
        'LOGGER_APP_NAME': 'famir-demo-console',
      },
      //instances: 1,
      node_args: "--env-file .env",
      kill_timeout: 10_000,
      watch: false
    },
    {
      name: 'famir-demo-reverse',
      script: 'dist/reverse/loaders/std.js',
      env: {
        'LOGGER_APP_NAME': 'famir-demo-reverse',
      },
      //instances: 1,
      node_args: "--env-file .env",
      kill_timeout: 10_000,
      watch: false
    },
    {
      name: 'famir-demo-analyze',
      script: 'dist/analyze/loaders/std.js',
      env: {
        'LOGGER_APP_NAME': 'famir-demo-analyze',
      },
      //instances: 1,
      node_args: "--env-file .env",
      kill_timeout: 10_000,
      watch: false
    }
  ]
}

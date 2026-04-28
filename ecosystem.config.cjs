module.exports = {
  apps: [
    {
      name: 'famir-demo-console',
      script: 'dist/console/loaders/net/index.js',
      env: {
        'LOGGER_APP_NAME': 'famir-demo-console',
      },
      instances: 1,
      node_args: "--env-file=.env --import=./dist/console/preload.js",
      kill_timeout: 10_000,
      watch: false
    },
    {
      name: 'famir-demo-reverse',
      script: 'dist/reverse/loaders/std/index.js',
      env: {
        'LOGGER_APP_NAME': 'famir-demo-reverse',
      },
      instances: 1,
      node_args: "--env-file=.env --import=./dist/reverse/preload.js",
      kill_timeout: 10_000,
      watch: false
    },
    {
      name: 'famir-demo-actions',
      script: 'dist/actions/loaders/std/index.js',
      env: {
        'LOGGER_APP_NAME': 'famir-demo-actions',
      },
      instances: 1,
      node_args: "--env-file=.env --import=./dist/actions/preload.js",
      kill_timeout: 10_000,
      watch: false
    }
  ]
}

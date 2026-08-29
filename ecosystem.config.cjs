module.exports = {
  apps: [
    {
      name: 'console',
      script: 'dist/console/loaders/net.js',
      instances: 1,
      node_args: "--env-file=.env --import=./dist/console/preload.js",
      kill_timeout: 10_000,
      watch: false
    },
    {
      name: 'reverse',
      script: 'dist/reverse/loaders/std.js',
      instances: 1,
      node_args: "--env-file=.env --import=./dist/reverse/preload.js",
      kill_timeout: 10_000,
      watch: false
    },
    {
      name: 'actions',
      script: 'dist/actions/loaders/std.js',
      instances: 1,
      node_args: "--env-file=.env --import=./dist/actions/preload.js",
      kill_timeout: 10_000,
      watch: false
    }
  ]
}

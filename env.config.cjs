module.exports = {
  env: {
    LOGGER_TRANSPORT_TARGET: 'pino-socket',
    LOGGER_TRANSPORT_OPTIONS: '{"address":"127.0.0.1", "port": 9000, "mode": "tcp"}',
    //DATABASE_CONNECTION_URL: 'redis://localhost:6379/0',
    //TASK_QUEUE_CONNECTION_URL: 'redis://localhost:6379/1',
    //TASK_WORKER_CONNECTION_URL: 'redis://localhost:6379/1',
  }
}

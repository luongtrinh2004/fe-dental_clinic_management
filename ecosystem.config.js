module.exports = {
  apps: [
    {
      name: 'RHM-Client',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3001',
      instances: '1',
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
}

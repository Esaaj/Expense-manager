module.exports = {
    apps: [
      {
        name: '',
        script: 'bin/www',
        args: '',
        instances: 1,
        autorestart: true,
        ignore_watch: ['node_modules', '.git', 'uploads'],
        watch: true,
        max_memory_restart: '1G',
        env_local: {
          NODE_ENV: 'local',
        }
      },
    ],
  };
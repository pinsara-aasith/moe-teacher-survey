module.exports = {
  apps: [
    {
      "name": "MOE ",
      "exec_mode": "cluster",
      "instances": 6,
      "cwd": "./",
      "script": "./node_modules/next/dist/bin/next",
      "args": "start",
      "env_local": {
        "APP_ENV": "local"
      },
      "env_dev": {
        "APP_ENV": "dev"
      },
      "env_production": {
        "APP_ENV": "production"
      }
    }
  ]
}

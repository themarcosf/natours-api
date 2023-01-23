config.env file to be save at root:

```shell
# default : development
# deploy config : production
NODE_ENV=development

# server host and port
PORT=8000
HOST=127.0.0.1

# database config, remote and local
DATABASE_LOCAL=mongodb://127.0.0.1:27017/<DB_NAME>
DATABASE_REMOTE=mongodb+srv://<USER>:<PASSWORD>@<CLUSTER>.<RANDOM_STRING>.mongodb.net/<DB_NAME>
DATABASE_PASSWORD=<PASSWORD>

# user authentication and authorization
JWT_SECRET=<SECRET>
JWT_EXPIRES=90d
JWT_COOKIE_EXPIRES=90

# corportate email config
SMTP_HOST=<SMTP_PROVIDER>
SMTP_PORT=<PORT>
EMAIL_USERNAME=<USERNAME>
EMAIL_PASSWORD=<PASSWORD>
```

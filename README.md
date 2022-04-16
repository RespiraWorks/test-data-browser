# RespiraWorks test data management system

This is the full implementation for RW's ventilator test data management solution currently provided at
[http://data.respira.works/](http://data.respira.works/).
It is made with javascript, react, express and react-bootstrap. Data is stored in MongoDB.

## Getting started

Install `npm`, preferrably using [nvm](https://github.com/nvm-sh/nvm). Install and switch to `Node v.16`:

```shell
nvm install 16
nvm use 16
```

You should probably also install `docker` (and `docker-compose` depending on your platform). You will need to add
yourself to the `docker` group as follows:

```shell
sudo groupadd docker
sudo usermod -aG docker $USER
```

And now start a new terminal for user privileges to take effect.

Clone the repository and install the Node modules.

```shell
# Clone the repository
git clone https://github.com/RespiraWorks/test-data-browser

# Go inside the directory
cd test-data-browser

# Install dependencies
npm install
```

You will need to configure a `.env` file to provide MongoDB credentials, something like this:

```dotenv
MONGO_USERNAME=foo
MONGO_PASSWORD=bar
MONGO_HOSTNAME=coolname.gibberish.mongodb.net
```

If you are using an external Mongo provider, remember to whitelist your IP.

### Development

To run the site locally and have it reload whenever you modify it, run as:

```shell
npm run dev
```
And it should automatically open [http://localhost:3000/](http://localhost:3000/) on your browser.

**Do all your fun development now...**

When you are ready to test the "production build" of the site, do:

```shell
# Build for production
npm run build

# Start production server
npm start
```

And you should be able to see it at [http://localhost:8080/](http://localhost:8080/)

To test docker-based deployment locally:

```shell
docker build . -t whatever
docker run -p 80:8080 whatever
```

...and now you can see it at [http://localhost/](http://localhost/)

You can also test it with
```shell
docker-compose up
```

### Deployment

Log into your site hosting machine.

Clone repository and set things up just like in the [Getting started](#getting-started) section above.

To spin up the site as a service:
```shell
docker-compose up -d
```

To stop it:
```shell
docker-compose down
```

To update it and delete old image versions:

```shell
git pull
docker-compose up --force-recreate --build -d
docker image prune -f
```

Occasionally, dependencies have failed to update automatically, so you may need to do `npm install` before rebuilding
the docker image.
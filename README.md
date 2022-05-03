# RespiraWorks test data management system

[![CircleCI Build Status](https://circleci.com/gh/RespiraWorks/test-data-browser.svg?style=shield)](https://circleci.com/gh/RespiraWorks/test-data-browser/tree/master)
[![pre-commit](https://img.shields.io/badge/pre--commit-enabled-brightgreen?logo=pre-commit&logoColor=white)](https://github.com/pre-commit/pre-commit)
[![GitHub commit activity](https://img.shields.io/github/commit-activity/m/RespiraWorks/test-data-browser)](https://github.com/RespiraWorks/test-data-browser/pulse)
[![Donate](https://img.shields.io/badge/donate-gofundme-blueviolet)](https://www.gofundme.com/f/RespiraWorks)

This is the full stack implementation for the RespiraWorks
[ventilator](https://github.com/RespiraWorks/Ventilator)
test data management system currently provided at
[http://data.respira.works/](http://data.respira.works/).
It is made with javascript, react, express and react-bootstrap. Data is stored in MongoDB.

[RespiraWorks](https://respira.works/) is a 501(c)(3) non-profit organization with over 200
contributors worldwide working to design a low-cost and open-source ventilator for communities
underserved by the global supply chain. Our objective is to provide the know-how and technology to
enable others to manufacture these systems and put them in the hands of those who need them most.

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
MONGO_URI=mongodb://user:password@localhost/?retryWrites=true&w=majority&authSource=admin
```
or
```dotenv
MONGO_URI=mongodb+srv://user:password@foo.bar.mongodb.net/?retryWrites=true&w=majority
```
while replacing `user`, `password` and specifying correct host name.

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

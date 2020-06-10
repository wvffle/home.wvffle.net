<!-- https://github.com/wvffle/home.wvffle.net -->

# Installing
Clone the repo and enter it.
```sh
yarn install
```

# Running
```sh
node server.js
```

# Development
Start the server and the buildsystem
```sh
setsid node server.js
setsid yarn rollup --watch -c rollup.config.js
```

## Testing
Navigate to localhost:8081/test.html

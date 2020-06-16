<!-- https://github.com/wvffle/home.wvffle.net -->

# Installing
1. Clone the repo and enter it.
```sh
yarn install
```
2. Install [Custom New Tab Page](https://github.com/MethodGrab/firefox-custom-new-tab-page) to preserve focus on address bar when opening new tab.
  1. Set new tab url to https://home.wvffle.net or your server url

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

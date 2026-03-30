# Famir demo project

An example project to demonstrate [Famir](https://github.com/bitnoize/famir) framework facilities.

## Install

```sh
# Install dependencies and build project
npm install
npm build

cp .env.example .env

# Modify credentials in .env file

# Start reverse app
npm run start:reverse:std

# Start console standalone cli app
npm run start:console:cli
# Or you can use console server app
npm run start:console:net

# Start analyze app
npm run start:analyze:std

```

## Campaigns

### httpbin.org

Using this mirror, you can make arbitrary requests to the server and see the result
from the donor site's perspective.

* Modify spec.json, change title
* Transparent reverse-proxy
* Handle streaming responses
* Capture some endpoints

[Live demo](https://httpbin.fake-mirrors.net/)

### sse.dev

This mirror is for testing SSE (Server-Sent-Events) operation.

* Handle streaming responses
* Transparent reverse-proxy

[Live demo](https://ssedev.fake-mirrors.net/)

### ja3.zone

This mirror shows JA3, JA4, PeetPrint and Akamai fingerprints of your browser.

* Transparent reverse-proxy

[Live demo](https://ja3zone.fake-mirrors.net)

### browserleaks.com

Suite of tools that offers a range of tests to evaluate the security and privacy of
your web browser.

* Transparent reverse-proxy

[Live demo](https://browserleaks.fake-mirrors.net)

### hackernews

This is an example of a typical website on the Internet with authentication.

* Change site title
* Capture auth session and login credentials and store to S3
* Bypass Google re-captcha v2
* Closed from the outside world via secret links aka 'lures'
* Block user logout to save captured session

[Live demo](https://hackernews.fake-mirrors.net/foo-bar-baz)


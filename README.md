# Famir demo project

An example project to demonstrate [Famir](https://github.com/bitnoize/famir) framework facilities.

## Install

It is assumed that [Caddy](https://caddyserver.com/) and [Redis](https://redis.io/) are already installed and configured.

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

## Usage

Prepare cluster:

```js
// Some destructive commands requires confirmSecret attribute.
// This attribute changes each time you use it, and is necessary to prevent accidental repeats.

// Cleanup entire database
await famir.cleanupDatabase({})

// Load lua scripts into Redis
await famir.loadDatabaseFunctions({})

```

Restore phishmap:

```js
let campaignId = 'httpbin'
let phishmap = JSON.parse(getAsset('phishmap-httpbin-local.json'))

await famir.restorePhishmap({phishmap, campaignId})

// Show campaign
await famir.listCampaigns()
await famir.readCampaign({ campaignId })

// Show proxies
await famir.listproxies({ campaignId })
await famir.readProxy({ campaignId, proxyId: 'default' })

// Show targets
await famir.listTargets({ campaignId })
await famir.readTarget({ campaignId, targetId: 'root' })

// Show redirectors
await famir.listRedirectors({ campaignId })
await famir.readRedirector({ campaignId, redirectorId: 'simple' })

// Show lures
await famir.listLures({ campaignId })
await famir.readLure({ campaignId, lureId: 'test' })
```


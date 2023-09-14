# bun-js-docker-isolation-provider

## Quick Start
```js
async ({ data, deep, require }) => {
    //your code
}
```
#### or install @archer-lotos/bun-js-tests package in deep


## Information about the routes
- `/healthz` - GET - 200 - Health check endpoint
  - Response:
    - `{}`
- `/init` - GET - 200 - Initialization endpoint
  - Response:
    - `{}`
- `/call` - GET - 200 - Call executable code of handler in this isolation provider
  - Request:
    - body:
      - params:
        - jwt: STRING - Deeplinks send this token, for create gql and deep client
        - code: STRING - Code of handler
        - data: {} - Data for handler execution from deeplinks
          > If this is type handler
          - oldLink - from deeplinks, link before transaction
          - newLink - from deeplinks, link after transaction
          - promiseId - from deeplinks, promise id
  - Response:
    - `{ resolved?: any; rejected?: any; }` - If resolved or rejected is not null, then it's result of execution


## Information about params in function

- `deep` - Deep Client instance
- `data` - Data for handler execution from deeplinks


## Examples
```js
async ({ data, deep, require }) => {
    return data;
}
```

```js
async ({ data, deep, require }) => {
    return await deep.select(1);
}
```

```js
async ({ data, deep, require }) => {
    return await deep.insert({
        "type_id": 58,
        "from_id": 0,
        "to_id": 0
    });
}
```

## Install/Build
```bash
npm install
npm ci && npm run package:build
docker build -t bun-js-docker-isolation-provider .
docker run -d -p 39100:39100 -e PORT=39100 bun-js-docker-isolation-provider
```

### Bun Build
```bash
npx bun build --target=bun ../index.ts --outfile=/index.js
```
#### or
```bash
npx bun build --compile /index.ts --outfile=/
```
#### or
```bash
npx bun build --minify --splitting --outdir=out ./index.ts
```
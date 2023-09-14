import { generateApolloClient } from "@deep-foundation/hasura/client.js";
import { DeepClient, parseJwt } from "@deep-foundation/deeplinks/imports/client.js";
import { gql } from '@apollo/client/index.js';
import memoize from 'lodash/memoize.js';
import { createRequire } from 'node:module';


const require = createRequire(import.meta.url);
const memoEval = memoize(eval);


const GQL_URN = process.env.GQL_URN || 'localhost:3006/gql';
const GQL_SSL = process.env.GQL_SSL || 0;

const requireWrapper = (id: string) => {
  // if (id === 'music-metadata') {
  //   return { parseStream, parseFile };
  // }
  return require(id);
}

DeepClient.resolveDependency = requireWrapper;

const toJSON = (data) => JSON.stringify(data, Object.getOwnPropertyNames(data), 2);

const makeFunction = (code: string) => {
  const fn = memoEval(code);
  if (typeof fn !== 'function')
  {
    throw new Error("Executed handler's code didn't return a function.");
  }
  return fn;
}

const makeDeepClient = (token: string) => {
  if (!token) throw new Error('No token provided');
  const decoded = parseJwt(token);
  const linkId = decoded?.userId;
  const apolloClient = generateApolloClient({
    path: GQL_URN,
    ssl: !!+GQL_SSL,
    token,
  });
  const deepClient = new DeepClient({ apolloClient, linkId, token }) as any;
  return deepClient;
}

console.log(`Listening ${process.env.PORT} port`);

const server = Bun.serve({
  port: process.env.PORT, // Specify the desired port
  async fetch(req, res, next) {
    const url = new URL(req.url);

    switch(url.pathname) { 
      case "/": { 
         return new Response("{}"); 
      } 
      case "/healthz": { 
        return new Response("{}"); 
      }
      case "/init": { 
        return new Response("{}"); 
      }
      case "/call": { 
        try {
          // const formdata = await req.formData();
          const bodyStr = await req.json()
          console.log('call body params', bodyStr);

          /*const { jwt, code, data } = formdata || {};
          const fn = makeFunction(code);
          const deep = makeDeepClient(jwt);
          const result = await fn({ data, deep, gql, require: requireWrapper }); // Supports both sync and async functions the same way
          console.log('call result', result);
          res.json({ resolved: result });*/
          return new Response("{}");
        }
        catch(rejected)
        {
          const processedRejection = JSON.parse(toJSON(rejected));
          console.log('rejected', processedRejection);
          res.json({ rejected: processedRejection });
        }
      }
      case "/http-call": { 
        try {
          const options = decodeURI(`${req.headers['deep-call-options']}`) || '{}';
          console.log('deep-call-options', options);
          const { jwt, code, data } = JSON.parse(options as string);
          const fn = makeFunction(code);
          const deep = makeDeepClient(jwt);
          await fn(req, res, next, { data, deep, gql, require: requireWrapper }); // Supports both sync and async functions the same way
        }
        catch(rejected)
        {
          const processedRejection = JSON.parse(toJSON(rejected));
          console.log('rejected', processedRejection);
          res.json({ rejected: processedRejection }); // TODO: Do we need to send json to client?
        }
      }
      case "/stop-server": { 
        console.log('Stopping server...');
        process.exit(0);
        return new Response("{}"); 
      }
      default: { 
        return new Response("404!");
      } 
   }
  },
  error() {
		return new Response(null, { status: 404 });
	},
});
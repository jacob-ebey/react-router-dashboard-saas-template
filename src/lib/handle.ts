declare global {
  var SERVER_HANDLES: WeakMap<object, Record<any, any>>;
}

const serverHandles = (globalThis.SERVER_HANDLES ??= new WeakMap());

export function createHandle<
  Input extends Record<any, any>,
  Client extends Record<any, any>,
  Server extends Record<any, any>
>(map: (input: Input) => { client: Client; server: Server }) {
  return {
    defineHandle: defineHandle.bind(null, map),
    getServerHandle,
  };
}

export function defineHandle<
  Input extends Record<any, any>,
  Client extends Record<any, any>,
  Server extends Record<any, any>
>(
  map: (input: Input) => {
    client: Client;
    server: Server;
  },
  input: Input
): unknown {
  const { client, server } = map(input);

  serverHandles.set(client, server);

  return client;
}

export function getServerHandle<
  Client extends Record<any, any>,
  Server extends Record<any, any>
>(handle: unknown): (Client & Server) | undefined {
  if (typeof handle !== "object" || handle === null) return undefined;
  const server = serverHandles.get(handle as object);
  return Object.assign({}, handle, server);
}

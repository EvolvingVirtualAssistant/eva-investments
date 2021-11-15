# Nodes

Description of the nodes objects structure, by types:

## Base Node Structure

As the name indicates, this is the structure every node must contain.

```typescript
{
    // Mandatory fields
    id: number // unique identifier for this node.
    host: string // host address for the node.
                 // Examples:
                 //     HTTP -> http://... or https://...
                 //     WS -> ws://... or wss://...
                 //     IPC -> /path/geth.ipc
    type: string // type of node. Possible values: HTTP, WS, IPC

    // Optional fields:
    keepAlive: boolean // used to keep the connection open
                       // useful for frequent messages exchange
                       // default: true
    timeout: number // after x amount of time in milliseconds,
                    // if there is no response, the connection times out
                    // default: 0 (no timeout) 
}
```

## HTTP Node

Type of node used for http based connections.

```typescript
{
    // All fields from base node
    ...

    // Optional fields:
    withCredentials: boolean // indicates whether cross-site access-control
                             // requests should be made using credentials
                             // default: false
    headers: [
        {
            name: string // header key
            value: string // header value
        },
        ...
    ] // pairs of keys and values used as headers for the underlying connection
}
```

Example:

```json
{
    "id": 1,
    "host": "http://localhost:8545",
    "type": "HTTP",
    "keepAlive": true,
    "timeout": 20000,
    "withCredentials": false,
    "headers": [
        {
            "name": "Access-Control-Allow-Origin",
            "value": "*"
        }
    ]
}
```

## Websocket Node

Type of node used for websocket based connections.

```typescript
{
    // All fields from base node
    ...

    // Optional fields:
    headers: [
        {
            name: string // header key
            value: string // header value
        },
        ...
    ] // pairs of keys and values used as headers for the underlying connection
    protocol: string // Underlying websocket sub-protocol
                     // default: undefined
    reconnectOptions: {
        // Optional fields
        auto: boolean // if true auto reconnection is enabled
                      // default: false
        delay: number // delay in milliseconds to start a new connection
                      // after the previous one being closed
        maxAttempts: number // number of maximum reconnectiong attempts
                            // default: 0
        onTimeout: boolean  // on response data parsing error, 
                            // if timeout is true, trigger a reconnection
                            // default: false
    } // Options used for enabling auto reconnection
    config: object // config options for the underlying websocket connection
                   // default: empty object {}
                   // Check the available options here:
                   // - https://github.com/theturtle32/WebSocket-Node/blob/master/docs/WebSocketClient.md#client-config-options
                   // - https://github.com/theturtle32/WebSocket-Node/blob/master/docs/WebSocketServer.md#server-config-options
                   // Note: Attention to the types used inside the object
                   // (i.e., 100000000 = 0x100000, both are supported)
    requestOptions: any // request options for the underlying 
                        // websocket connection
                        // default: undefined
                        // Check the notes here:
                        // - https://github.com/theturtle32/WebSocket-Node/blob/master/docs/WebSocketClient.md#connectrequesturl-requestedprotocols-origin-headers-requestoptions
}
```

Example:

```json
{
    "id": 2,
    "host": "ws://localhost:8545",
    "type": "WS",
    "keepAlive": true,
    "timeout": 30000,
    "headers": [
        {
            "name": "authorization",
            "value": "Basic username:password"
        }
    ],
    "protocol": "some-protocol-v1",
    "reconnectOptions": {
        "auto": true,
        "delay": 5000,
        "maxAttempts": 5,
        "onTimeout": false
    },
    "config": {
        "maxReceivedFrameSize": 100000000,
        "maxReceivedMessageSize": 100000000,
        "keepaliveInterval": 60000
    },
    "requestOptions": {
        "agent": false
    }
}
```

## IPC Node

Type of node used for ipc based connections.

```typescript
{
    // All fields from base node
    ...

    // In the future we may support options for the underlying socket
    
}
```

Example:

```json
{
    "id": 3,
    "host": "/Users/me/Library/Ethereum/geth.ipc",
    "type": "IPC",
    "keepAlive": true,
    "timeout": 50000
}
```

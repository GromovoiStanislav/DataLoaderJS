## Using DataLoader with Redis (redis) (JS)

Redis is a very simple key-value store which provides the batch load method [MGET][] which makes it very well suited for use with DataLoader.

Here we build an example Redis DataLoader using [node_redis][].

#### Start

```
npm start
```

[node_redis]: https://github.com/NodeRedis/node_redis
[MGET]: http://redis.io/commands/mget

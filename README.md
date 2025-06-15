## Repo Structure

The repo is split into backend (typescript/node.js) and web (react/typescript).

## Docker To Build with tag

Private repo is https://hub.docker.com/repository/docker/robtaylor/iamrobtaylor/general

# Build

```
docker build -t robtaylor/iamrobtaylor:v1.0.5 .
```

# Push

```
docker push robtaylor/iamrobtaylor:v1.0.5
```

## To Run

```
docker run -d --net=host -v /home/ubuntu/iamrobtaylor/certs:/usr/src/app/backend/dist/certs --env-file=env.list robtaylor/iamrobtaylor:v1.0.6
```

## ssl certs

- certbot used to generate certs: https://certbot.eff.org/instructions?ws=other&os=snap

- They update live on the box /etc/letsencrypt/live/iamrobtaylor.com

- copied to /home/ubuntu/iamrobtaylor/certs temporarily - would need to update when certs update
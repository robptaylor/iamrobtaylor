## Repo Structure

The repo is split into backend (typescript/node.js) and web (react/typescript).

## To Build with tag

docker build -t robtaylor/iamrobtaylor:v1.0.5 .

## To push

docker push robtaylor/iamrobtaylor:v1.0.5

## To Run

docker run -d --net=host -v /etc/letsencrypt/live/iamrobtaylor.com:/usr/src/app/backend/dist/certs --env-file=env.list robtaylor/iamrobtaylor:v1.0.5

## root

sudo su - root


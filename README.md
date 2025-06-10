## Repo Structure

The repo is split into backend (typescript/node.js) and web (react/typescript).

## To Build with tag

docker build -t robtaylor/iamrobtaylor:v1.0.5 .

## To push

docker push robtaylor/iamrobtaylor:v1.0.5

## To Run

docker run -d --net=host -v /home/ubuntu/iamrobtaylor/certs:/usr/src/app/backend/dist/certs --env-file=env.list robtaylor/iamrobtaylor:v1.0.6

## root

sudo su - root

## ssl certs

- certbot used to generate certs: https://certbot.eff.org/instructions?ws=other&os=snap

- They update live on the box /etc/letsencrypt/live/iamrobtaylor.com

- copied to /home/ubuntu/iamrobtaylor/certs as docker volume mounting was being annoying with symlinks so need to remember to copy over again when they expire
# A simple code viewer
## Features:
- web
- local files
- self-hosting
- high light code
- fast
## docker-cli(recommend)

```
docker run --name code-viewer -p 3000:3000 --env "username={Fill in your username}" --env "password={Fill in your password}" -v "{Fill in your code path}:/app/source" chegde/code-viewer  
```

## docker-compose

```
version: "3"
services:
  viewer-project:
    container_name: "code"
    build: chegde/code-viewer:latest
    restart: always
    ports:
      - 3000:3000
    volumes:
      - {Fill in your code path}:/app/source
    environment:
      - username={Fill in your username}
      - password={Fill in your password}
```

## development command
```
npm install
npm run dev
```

## open the Web page
```
open http://localhost:3000
```

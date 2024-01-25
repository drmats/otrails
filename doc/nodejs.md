# Containerized Nodejs

<br />




## reset podman
```bash
podman system reset
sudo rm -rf ~/.local/share/containers/
```

<br />




## official LTS node image

### pull image
```bash
podman search node --filter=is-official
podman pull docker.io/library/node:20
```

### run node interpreter once
```bash
podman run -it --rm --net host node:20 node
```

### run node script once
```bash
podman run -it --rm --net host -v $(pwd):/usr/src/app -w /usr/src/app node:20 node script.js
```

### run yarn
```bash
podman run -it --rm --net host -v $(pwd):/usr/src/app -w /usr/src/app node:20 yarn
```

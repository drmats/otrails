# Containerized PostgreSQL/PostGIS

<br />




## reset podman
```bash
podman system reset
sudo rm -rf ~/.local/share/containers/
```




## official postgres image

### pull image
```bash
podman search postgres --filter=is-official
podman pull docker.io/library/postgres
```

### create and start container
```bash
podman run \
    -e POSTGRES_USER=robot \
    -e POSTGRES_PASSWORD=robot \
    -e POSTGRES_DB=otrails \
    -e PGDATA=/var/lib/postgresql/data/pgdata \
    --name otrails-postgres \
    -p 0.0.0.0:5432:5432 \
    -v $(pwd)/data/pg:/var/lib/postgresql/data \
    -d docker.io/library/postgres
```

### start and stop container
```bash
podman container list --all
podman start otrails-postgres
podman stop otrails-postgres
```

### run psql inside container
```bash
podman exec -it otrails-postgres psql -U robot postgres
```




## official postgis image

### pull image
```bash
podman pull docker.io/postgis/postgis
```

### create and start container
```bash
podman run \
    -e POSTGRES_USER=robot \
    -e POSTGRES_PASSWORD=robot \
    -e POSTGRES_DB=otrails \
    -e PGDATA=/var/lib/postgresql/data/pgdata \
    --name otrails-postgis \
    -p 0.0.0.0:5432:5432 \
    -v $(pwd)/data/pg:/var/lib/postgresql/data \
    -d docker.io/postgis/postgis
```

### start and stop container
```bash
podman container list --all
podman start otrails-postgis
podman stop otrails-postgis
```

### run psql inside container
```bash
podman exec -it otrails-postgis psql -U robot otrails
```

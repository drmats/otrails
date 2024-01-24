# otrails

Trails. Ours.

<br />




## quickstart

### dependencies
* install [podman](https://podman.io/) on your system
* create and start [PostGIS](https://hub.docker.com/r/postgis/postgis) container - follow instructions in [Containerized PostgreSQL/PostGIS](./doc/postgres.md) document
* pull [node](https://hub.docker.com/_/node) image - follow instructions in [Containerized Nodejs](./doc/nodejs.md) document

### vs code workspace for development
* open `.vscode/iscriversi.code-workspace`

### virtual environment
Open terminal inside project directory and type:
```bash
. ./.venv
```

### check
* `node -v` (should print `v20.11.0`)
* `npm --version` (should print `10.2.4`)
* `yarn --version` (should print `1.22.19`)
* `psql --version` (should print `psql (PostgreSQL) 16.1 (Debian 16.1-1.pgdg110+1)`)

<br />




## variables interface

* list
    ```
    yarn vars
    ```
* add
    ```
    yarn vars set [KEY] [VAL]
    ```
* remove
    ```
    yarn vars del [KEY]
    ```

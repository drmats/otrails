# otrails

Trails. Open.

<br />




## quickstart

### dependencies

* install **[podman](https://podman.io/)** on your system - this is the only
    system-wide depencency (follow
    [official installation instructions](https://podman.io/docs/installation),
    [Red Hat podman-mac article](https://www.redhat.com/sysadmin/run-containers-mac-podman)
    or [Red Hat podman-windows article](https://www.redhat.com/sysadmin/run-podman-windows))

### containers

* create and start [PostGIS](https://hub.docker.com/r/postgis/postgis)
    container - follow a _very short_ instructions in the **quickstart** section in
    [**Containerized PostgreSQL/PostGIS**](./doc/postgres.md) document
* pull [node](https://hub.docker.com/_/node) image - follow
    _even shorter_ instructions in the **quickstart** section in
    [**Containerized Nodejs**](./doc/nodejs.md) document

<br />




## virtual environment

This project relies on tools installed within containers (`node`, `yarn`,
`postgresql`), so in order to ease the development process a python-like
"virtualenv" script is provided, with all paths and command alias definitions
(`bash` and `zsh` compatible).

Please make sure you're in the **repository root** directory and have `podman`
command available (`podman --version` should print `podman version x.x.x`).

### enable

Open terminal inside project directory and type:

```bash
. ./.venv
```

> In order to interact with the project you should invoke above command **once
> per every new terminal session** (new terminal window, new tmux pane etc.).

### check

* `node -v` (should print `v20.11.0`)
* `npm --version` (should print `10.2.4`)
* `yarn --version` (should print `1.22.19`)
* `psql --version` (should print
    `psql (PostgreSQL) 16.1 (Debian 16.1-1.pgdg110+1)`)

<br />




## package management

Project uses `workspaces` and it's packages are currently managed with
[`yarn-classic`](https://classic.yarnpkg.com/en/docs) (which is provided
with [node](https://hub.docker.com/_/node) container image).

In order to install or update packages needed by project, open terminal
inside repository root and type:

```bash
yarn
```

> Don't forget about enabling **virtual environment** first.

<br />




## vs code workspace for development

Open `.vscode/otrails.code-workspace` file.

<br />




## command line interface

Basic tool for testing, prototyping, running tasks and interactive development
is maintained in [`packages/cli/`](./packages/cli/) project directory.

* continuous build (watches project files and automatically rebuild on change)
    ```
    yarn dev:cli
    ```
* typecheck and lint
    ```
    yarn test:cli
    ```
* production build
    ```
    yarn build:cli
    ```
* running
    ```
    cli --help
    ```
    ```
    cli <command>

    Commands:
    cli hello                         database connection and versions
    cli dev [cwd]                     development console

    Options:
    --version  Show version number
    --help     Show help

    Visit https://wchmurach.com.pl/
    ```

<br />




## wrap up

If the development environment is set properly, then invoking `cli hello`
command should succeed.

```
cli hello
```
```
database in use: localhost:5432/otrails

app name: @xcmats/otrails-cli-0.0.1
app build: 25836d9-2024-01-30T08:52:02+01:00

executing: 3e62ef052ba57761c6b8.sql
    PostgreSQL 16.1 (Debian 16.1-1.pgdg110+1) on x86_64-pc-linux-gnu
    compiled by gcc (Debian 10.2.1-6) 10.2.1 20210110
    64-bit

executing: c5fd6e9e00b3d255f642.sql
    POSTGIS: "3.4.1 ca035b9"
    PGSQL: "160"
    GEOS: "3.9.0-CAPI-1.16.2"
    LIBXML: "2.9.10"
    LIBJSON: "0.15"
    LIBPROTOBUF: "1.3.3"
    WAGYU: "0.5.0 (Internal)"
```

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

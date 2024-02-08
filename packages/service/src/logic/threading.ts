/**
 * Otrails - trails, open.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

/* eslint-disable no-console */

import cluster from "node:cluster";
import { cpus } from "node:os";
import chalk from "chalk";
import { head, range } from "@xcmats/js-toolbox/array";

import type { InitConfig } from "~service/logic/configuration";
import { main } from "~service/logic/main";
import { buildLogger } from "~service/setup/logging";




/**
 * Political un-correctness.
 */
export const iAmMaster = (): boolean =>
    parseInt(head(process.versions.node.split(".")), 10) < 16
        ? cluster.isMaster : cluster.isPrimary;




/**
 * Shape of messages that are interchanged between master process and workers.
 */
export type ClusterMessage  = {
    command: "start" | "stop";
    configs: InitConfig;
    ready: boolean;
    firstWorker: boolean;
};




/**
 * Master process.
 */
export const master = async (opts: {
    configs: InitConfig;
}): Promise<void> => {

    // fork as many process workers as detected logical cpus
    const ids = range(cpus().length).map(cluster.fork).map((w) => w.id);

    // send configs to each process
    cluster.on("message", (w, msg: ClusterMessage) => {
        setTimeout(() => {
            if (msg.ready) w.send({
                command: "start",
                firstWorker: w.id === head(ids),
                configs: opts.configs,
            });
        }, Math.abs(ids.indexOf(w.id) * 100));
    });

    // local/isolated logger instance
    const logger = buildLogger();

    // master termination signalling
    process.on("SIGHUP", () => {
        logger.info(
            `[${chalk.yellow("SIGHUP")}]:master:${chalk.blueBright(process.pid)} `,
        );
    });

    process.on("SIGINT", () => {
        logger.info(
            `[${chalk.yellow("SIGINT")}]:master:${chalk.blueBright(process.pid)} `,
        );
    });

    process.on("SIGTERM", () => {
        logger.info(
            `[${chalk.yellow("SIGTERM")}]:master:${chalk.blueBright(process.pid)} `,
        );
    });

    // report master is up
    logger.info("[master process]", `pid:[${chalk.green(process.pid)}]`);
};




/**
 * Worker process.
 */
export const worker = async (): Promise<void> => {

    let isRunning = false;

    // run logic when "start" command with configs is received
    process.on("message", (msg: ClusterMessage) => {
        if (msg.command === "start" && !isRunning) {
            isRunning = true;
            void main({
                configs: msg.configs,
                firstWorker: msg.firstWorker,
            });
        }
    });

    // send "ready" message to master process
    if (process.send) process.send({ ready: true });

};

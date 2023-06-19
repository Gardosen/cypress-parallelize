import fs from "fs";
import path from "path";
const spawn = require( 'child_process' ).spawn;
const scope = require( './scope' );
const logger = require( './logger' );


const runnerList = [];

export async function executeCommandXTimes(executionDetails) {
    if( !scope.options.dryRun ) {
        //new variant
        const timeMap = new Map();
        const promise = new Promise((resolve, reject) => {
            const processOptions = {
                cwd: process.cwd(),
                stdio: 'inherit',
                shell: true
            };

            const child = spawn(executionDetails.command, processOptions);
            child.on('exit', (exitCode) => {
                resolve(timeMap);
            });
        });

        return promise;
    }
}

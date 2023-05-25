const scope = require('./scope');
const moment = require('moment');


export function log(info){
    console.log(`[${moment().format('YYYY-MM-DD--HH-mm-ss')}] ${scope.options.dryRun? '[DryRun] ':''}${info}`);
}

export function error(info){
    console.error(`[${moment().format('YYYY-MM-DD--HH-mm-ss')}] ${scope.options.dryRun ? '[DryRun] ' : ''}${info}`);
}
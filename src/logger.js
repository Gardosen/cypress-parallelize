import scope from "./scope";


export function log(info){
    console.log(`${scope.options.dryRun? '[DryRun] ':''}${info}`);
}

export function error(info){
    console.error(`${scope.options.dryRun ? '[DryRun] ' : ''}${info}`);
}
import fs from "fs";
import path from "path";
const scope = require("./scope");
const logger = require('./logger');

export function scanFeatureFiles(dir){
    logger.log(`Reading files from folder ${dir}`);
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            scanFeatureFiles(file+"/");
        } else {
            if(!path.parse(file).base.startsWith(".") && path.parse(file).base.endsWith(".feature")) {
                scope.featureFileList.push(file);
            }
        }
    });
}

export function getFolderListByRegExp(regexp, folderToScan = process.cwd()){
    return fs.readdirSync(folderToScan, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory() && regexp.test(dirent.name))
        .map(dirent => `${folderToScan}/${dirent.name}`);
}
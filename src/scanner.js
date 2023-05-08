import fs from "fs";
import path from "path";
const scope = require("./scope");

export function scanFeatureFiles(dir){
    console.log(`Reading files from folder ${dir}`);
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
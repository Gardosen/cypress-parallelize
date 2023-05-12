import {parameterMap} from "./arguments-parser";


export async function showHelp(){
    let helpScreen = `+-----------------------------------------------+
|                Help Description               |
+-----------------------------------------------+\n
`;
    Object.keys(parameterMap).forEach(key => {
        let parameter = parameterMap[key];
        helpScreen += `${parameter.label}\n    Type: ${parameter.type.name} Default: ${parameter.default}\n    Description: ${parameter.description}\n${parameter.examples.length > 0? `    Examples: ${parameter.examples}\n`:""}${parameter.requires.length > 0? `    Required parameter: ${parameter.requires}\n`:""}\n`;
    });

helpScreen += `+-----------------------------------------------+`;
return helpScreen;
}
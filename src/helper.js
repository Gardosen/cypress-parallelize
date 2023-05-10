import {parameterMap} from "./arguments-parser";


export async function showHelp(){
    let helpScreen = `+-----------------------------------------------+
|                Help Description               |
+-----------------------------------------------+\n
`;
    Object.keys(parameterMap).forEach(key => {
        let parameter = parameterMap[key];
        helpScreen += `Parameter\n  ${parameter.label} \n    Type: ${parameter.type.name} Default: ${parameter.default}\n    Description: ${parameter.description}\n    Examples: ${parameter.examples}\n`
        helpScreen += `+-------------------------------\n`
    });

helpScreen += `+-----------------------------------------------+`;
return helpScreen;
}
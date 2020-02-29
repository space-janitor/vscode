"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const SJCommon = __importStar(require("@space-janitor/common"));
const Common = __importStar(require("./common"));
var logger = SJCommon.getLog4JSLogger(module.filename);
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    logger.info('== activate begins ==');
    SJCommon.intializeLogging({
        appenders: { 'outputAppender': { type: require.resolve('./outputAppender'), layout: { type: 'basic' } } },
        categories: { default: { appenders: ["outputAppender"], 'level': 'debug' } }
    }).then(() => {
        logger.info("== Activation begins ==");
        Common.activate(context);
        if (!Common.configuration || !Common.configuration.configured) {
            logger.warn("Extension is not enabled.");
        }
        else {
            // Use the console to output diagnostic information (console.log) and errors (console.error)
            // This line of code will only be executed once when your extension is activated
            // logger.debug('Congratulations, your extension "hog-vscode-fhir" is now active!');
            // The command has been defined in the package.json file
            // Now provide the implementation of the command with registerCommand
            // The commandId parameter must match the command field in package.json
            // context.subscriptions.push(disposable);
            logger.info("Extension is enabled.");
        }
        logger.info('== activate ends ==');
    }).catch(err => {
        console.error(err);
    });
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
    logger.info('== deactivate begins');
    Common.deactivate();
    logger.info('== deactivate ends');
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map
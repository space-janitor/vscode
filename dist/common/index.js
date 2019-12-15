'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./logging"));
const VSCode = __importStar(require("vscode"));
const configuration_1 = require("./configuration");
const util_1 = require("util");
const Logging = __importStar(require("./logging"));
const Util = __importStar(require("util"));
var logger = Logging.getLog4JSLogger(module.filename);
function activate(extensionContext) {
    Logging.intializeLogging({
        appenders: { 'outputAppender': { type: require.resolve('./outputAppender'), layout: { type: 'basic' } } },
        categories: { default: { appenders: ["outputAppender"], 'level': 'debug' } }
    });
    if (!util_1.isUndefined(exports.configuration) && (exports.configuration.configured)) {
        logger.info('Configuration already initialized.');
    }
    let disposable = VSCode.commands.registerCommand('configurations.configure', configure);
    extensionContext.subscriptions.push(disposable);
    if (Util.isNullOrUndefined(VSCode.workspace.workspaceFile)) {
        logger.warn("There is no active workspace. The hog-vscode-fhir extension requires an active workspace.");
        return;
    }
    logger.info('== activate begins ==');
    exports.configuration = new configuration_1.Configuration(extensionContext);
    exports.configuration.initialize();
    extensionContext.subscriptions.push(VSCode.workspace.onDidChangeWorkspaceFolders(e => onDidChangeWorkspaceFolders(e)));
    extensionContext.subscriptions.push(VSCode.workspace.onDidChangeConfiguration(e => onDidChangeConfiguration(e)));
    logger.info('== activate ends ====');
}
exports.activate = activate;
function deactivate() {
    logger.info('== deactivate begins ==');
    logger.info('== deactivate ends ====');
}
exports.deactivate = deactivate;
function testLogger() {
    try {
        // AWS.initialize();
        logger.trace('Entering cheese testing');
        logger.debug('Got cheese.');
        logger.info('Cheese is Comté.');
        logger.warn('Cheese is quite smelly.');
        logger.error('Cheese is too ripe!');
        logger.fatal('Cheese was breeding ground for listeria.');
    }
    catch (ex) {
        console.error(ex);
    }
}
exports.testLogger = testLogger;
function onDidChangeWorkspaceFolders(e) {
    logger.info(`WorkspaceFolders changed. ${e.added.join(',')} added & ${e.removed.join(',')} removed."`);
}
function onDidChangeConfiguration(e) {
    logger.info('VSCode configuration changed.');
    if (e.affectsConfiguration('hog-vscode-fhir').valueOf()) {
        VSCode.window.showInputBox({ prompt: "Workspace configuration has changed. Do you want to restart VSCode?", ignoreFocusOut: true, placeHolder: "Enter 'yes' to reload" }).then((value) => {
            if (Util.isNullOrUndefined(value)) {
                VSCode.window.showWarningMessage('You have choosen not to restart VSCode.');
            }
            else {
                VSCode.commands.executeCommand('workbench.action.reloadWindow');
            }
        });
    }
}
function configure() {
    return __awaiter(this, void 0, void 0, function* () {
        yield VSCode.window.showOpenDialog({ canSelectFolders: true, canSelectFiles: false, canSelectMany: false, openLabel: 'Select DataFolder' }).then((path => {
            if ((path)) {
                exports.configuration.setDataFolder(decodeURI(path[0].fsPath));
            }
            else {
                logger.warn('User setting hog-vscode-fhir.HomeWorkspaceFolder was not set.');
                exports.configuration.configured = false;
            }
        }));
    });
}
exports.configure = configure;
//# sourceMappingURL=index.js.map
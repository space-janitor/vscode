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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const VSCode = __importStar(require("vscode"));
const SJCommon = __importStar(require("@space-janitor/common"));
const Util = __importStar(require("util"));
const Path = __importStar(require("path"));
const Common = __importStar(require("./index"));
const OS = __importStar(require("os"));
const logger = SJCommon.getLog4JSLogger(module.filename);
function activateCommands(context) {
    let disposable = VSCode.commands.registerCommand('common.setDataFolder', setDataFolder);
    context.subscriptions.push(disposable);
    disposable = VSCode.commands.registerCommand('common.addDataFolderToWorkspace', addPersonalDataFolderToWorkspace);
    context.subscriptions.push(disposable);
    disposable = VSCode.commands.registerCommand('common.testLogger', testLogger);
    context.subscriptions.push(disposable);
    disposable = VSCode.commands.registerCommand('common.debug', debug);
    context.subscriptions.push(disposable);
}
exports.activateCommands = activateCommands;
function setDataFolder() {
    return __awaiter(this, void 0, void 0, function* () {
        yield VSCode.window.showOpenDialog({ canSelectFolders: true, canSelectFiles: false, canSelectMany: false, openLabel: 'Select DataFolder' }).then((path => {
            if ((path)) {
                Common.configuration.setDataFolder(decodeURI(path[0].fsPath));
            }
            else {
                logger.warn('User setting hog-vscode-fhir.HomeWorkspaceFolder was not set.');
            }
        }));
    });
}
exports.setDataFolder = setDataFolder;
function addPersonalDataFolderToWorkspace() {
    let dataFolder = Path.join(OS.userInfo().homedir, '.space-janitor');
    if (Util.isNullOrUndefined(VSCode.workspace.getWorkspaceFolder(VSCode.Uri.parse(`${Common.FILE_URI_SCHEME}${dataFolder}`)))) {
        VSCode.workspace.updateWorkspaceFolders(0, null, { uri: VSCode.Uri.parse(`${Common.FILE_URI_SCHEME}${dataFolder}`), name: 'Personal' });
    }
    else {
        logger.warn(`Folder ${dataFolder} already exist your workspace.`);
    }
}
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
function debug() {
    logger.debug(`OS.platform: ${OS.platform()}`);
    logger.debug(`OS.arch: ${OS.arch()}`);
    logger.debug(`OS.userInfo: ${JSON.stringify(OS.userInfo(), null, 2)}`);
    Common.configuration.debug();
    logger.debug(`VSCode.workspace.name: ${VSCode.workspace.name}`);
    logger.debug(`VSCode.workspace.workspaceFile: ${VSCode.workspace.workspaceFile}`);
    logger.debug(`VSCode.workspace.workspaceFolders: ${JSON.stringify(VSCode.workspace.workspaceFolders, null, 2)}`);
}
//# sourceMappingURL=commands.js.map
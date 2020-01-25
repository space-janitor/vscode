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
// export * from './logging';
const VSCode = __importStar(require("vscode"));
const SJCommon = __importStar(require("@space-janitor/common"));
const OS = __importStar(require("os"));
const configuration_1 = require("./configuration");
const Commands = __importStar(require("./commands"));
const Util = __importStar(require("util"));
const logger = SJCommon.getLog4JSLogger(module.filename);
exports.FILE_URI_SCHEME = OS.platform() === 'win32' ? 'file:///' : 'file://';
function activate(context) {
    if (!Util.isUndefined(exports.configuration) && (exports.configuration.configured)) {
        logger.info('Configuration already initialized.');
        return;
    }
    // if (Util.isNullOrUndefined(VSCode.workspace.workspaceFile)) {
    //     logger.warn("There is no active workspace. The hog-vscode-fhir extension requires an active workspace.");
    //     return;
    // }
    logger.info('== activate begins ==');
    exports.configuration = new configuration_1.Configuration(context);
    exports.configuration.initialize();
    context.subscriptions.push(VSCode.workspace.onDidChangeWorkspaceFolders(e => onDidChangeWorkspaceFolders(e)));
    context.subscriptions.push(VSCode.workspace.onDidChangeConfiguration(e => onDidChangeConfiguration(e)));
    Commands.activateCommands(context);
    logger.info('== activate ends ====');
}
exports.activate = activate;
function deactivate() {
    logger.info('== deactivate begins ==');
    logger.info('== deactivate ends ====');
}
exports.deactivate = deactivate;
function onDidChangeWorkspaceFolders(e) {
    logger.info(`WorkspaceFolders changed. ${e.added.join(',')} added & ${e.removed.join(',')} removed."`);
}
function onDidChangeConfiguration(e) {
    logger.warn('VSCode configuration changed.');
    // if (e.affectsConfiguration('hog-vscode-fhir').valueOf()) {
    //     VSCode.window.showInputBox({ prompt: "Workspace configuration has changed. Do you want to restart VSCode?", ignoreFocusOut: true, placeHolder: "Enter 'yes' to reload" }).then((value) => {
    //         if (Util.isNullOrUndefined(value)||value !== 'yes') {
    //             VSCode.window.showWarningMessage('You have choosen not to restart VSCode.');
    //         } else {
    //             VSCode.commands.executeCommand('workbench.action.reloadWindow');
    //         }
    //     });
    // }
}
function openTextEditor(filename, viewColumn = 1) {
    return __awaiter(this, void 0, void 0, function* () {
        VSCode.window.showTextDocument(VSCode.Uri.parse(`${exports.FILE_URI_SCHEME}${filename}`), { preview: false, viewColumn: viewColumn }).then(textEditor => {
            logger.info(`TextEditor loaded`);
        });
    });
}
exports.openTextEditor = openTextEditor;
//# sourceMappingURL=index.js.map
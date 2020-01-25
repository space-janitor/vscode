// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as VSCode from 'vscode';
import * as SJCommon from '@space-janitor/common';
import * as Common from './common';
import * as Util from 'util';

var logger = SJCommon.getLog4JSLogger(module.filename);

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: VSCode.ExtensionContext) {
	SJCommon.intializeLogging({
		appenders: { 'outputAppender': { type: require.resolve('./outputAppender'), layout: { type: 'basic' } } },
		categories: { default: { appenders: ["outputAppender"], 'level': 'debug' } }
	}).then(() => {
		logger.info("== Activation begins ==");
		Common.activate(context);
		if (Util.isNullOrUndefined(Common.configuration) || Util.isNullOrUndefined(Common.configuration.configured) || !Common.configuration.configured) {
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
	}).catch(err=>{
		console.error(err);
	});
}

// this method is called when your extension is deactivated
export function deactivate() {
	Common.deactivate();
}

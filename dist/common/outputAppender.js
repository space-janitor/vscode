'use strict';
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const VSCode = __importStar(require("vscode"));
const Log4JS = __importStar(require("log4js"));
var outputChannel = VSCode.window.createOutputChannel("hog-vscode-fhir");
outputChannel.show();
function stdoutAppender(layout, timezoneOffset) {
    // This is the appender function itself
    return (loggingEvent) => {
        let message = `${layout(loggingEvent, timezoneOffset)}`;
        outputChannel.appendLine(message);
        switch (loggingEvent.level) {
            case Log4JS.levels.WARN:
                VSCode.window.showWarningMessage(message);
                break;
            case Log4JS.levels.FATAL:
            case Log4JS.levels.ERROR:
                VSCode.window.showErrorMessage(message);
        }
    };
}
// stdout configure doesn't need to use findAppender, or levels
function configure(config, layouts) {
    // the default layout for the appender
    let layout = layouts.basic;
    // check if there is another layout specified
    if (config.layout) {
        // load the layout
        layout = layouts.layout(config.layout.type, config.layout);
    }
    //create a new appender instance
    return stdoutAppender(layout, config.timezoneOffset);
}
exports.configure = configure;
//# sourceMappingURL=outputAppender.js.map
'use strict';
import * as VSCode from 'vscode';
import * as Log4JS from 'log4js';
var outputChannel = VSCode.window.createOutputChannel("hog-vscode-fhir");
outputChannel.show();

function stdoutAppender(layout:any, timezoneOffset:any) {
    // This is the appender function itself
    return (loggingEvent:Log4JS.LoggingEvent) => {
        let message = `${layout(loggingEvent, timezoneOffset)}`;
        outputChannel.appendLine(message);
        switch(loggingEvent.level){
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
export function configure(config:any, layouts:any) {
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
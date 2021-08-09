import * as vscode from 'vscode';
import { removeSync, outputFile  } from 'fs-extra';
import { exec } from 'child_process';
import { getTemplateFileContent, dealSvgFile } from './utils/index';
import { join } from 'path';

const rootPath = '/Users/shenjiaqi/Desktop/Home/learning/2021-plan';

export function activate(context: vscode.ExtensionContext) {
	let openPlatform = vscode.commands.registerCommand('HxmIcon.OpenPlatform', uri => {
    const panel = vscode.window.createWebviewPanel(
      'webview',
      '同花顺Icon',
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
      }
    );
    panel.webview.html = getTemplateFileContent(context, 'index.html', panel.webview);
    panel.webview.onDidReceiveMessage(
      async message => {
        switch(message.command) {
          case 'exportSvgSymbolsFile':
            const uri = await vscode.window.showSaveDialog({
              filters: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'Javascript': ['js']
              }
            });
            const saveDir = uri.path.split('/').slice(0, -1).join('/');
            const svgPath = `${saveDir}/svg`;
            const outPath = `${saveDir}/out`;
            removeSync(svgPath);
            message.data.forEach(item => {
              outputFile(`${svgPath}/icon-${item.name}.svg`, dealSvgFile(item.svg), 'utf-8');
            });
            exec(`cd ${join(__dirname, '../src/utils')} && gulp default --svgPath ${svgPath} --outPath ${outPath}`,
              (err, data, stderr) => {
                removeSync(svgPath);
            });
            break;
        }
      },
      undefined,
      context.subscriptions
    );
	});

	context.subscriptions.push(openPlatform);
}

export function deactivate() {}

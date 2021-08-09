import * as vscode from 'vscode';
import * as fs from 'fs';
import { getTemplateFileContent } from './utils/index';

export function activate(context: vscode.ExtensionContext) {
	let openPlatform = vscode.commands.registerCommand('HxmIcon.OpenPlatform', () => {
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
            // 获取保存路径
            // 生成svg-symbols.js
            const dir = uri.path.split('/').slice(0, -1).join('/');
            fs.readFile(`${dir}/sss.js`, (err, data) => {
              console.log(err);
              console.log(data.toString());
            });
            console.log(dir);
            console.log(message.data);
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

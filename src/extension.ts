import * as vscode from 'vscode';
import { removeSync, outputFile  } from 'fs-extra';
import { exec } from 'child_process';
import { getTemplateFileContent, dealSvgFile } from './utils/index';
import { join } from 'path';
import { Low, JSONFile } from 'lowdb';

type Data = {
  posts: {} // object
};

const adapter = new JSONFile<Data>(join(__dirname,'db.json'));
const db = new Low<Data>(adapter);
db.data ||= { posts: {} }; // 设置默认值

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
              outputFile(`${svgPath}/icon-${item.en_name}.svg`, dealSvgFile(item.svg), 'utf-8');
            });
            exec(`cd ${join(__dirname, '../src/utils')} && gulp default --svgPath ${svgPath} --outPath ${outPath}`,
              (err, data, stderr) => {
                // 移除掉svg文件夹
                removeSync(svgPath);
            });
            break;
          case 'exportSvgFile':
            const uri1 = await vscode.window.showSaveDialog({
              filters: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'Javascript': ['js']
              }
            });
            const saveDir1 = uri1.path.split('/').slice(0, -1).join('/');
            const svgPath1 = `${saveDir1}/svg`;
            removeSync(svgPath1);
            message.data.forEach(item => {
              console.log(`${svgPath1}/icon-${item.en_name}.svg`);
              outputFile(`${svgPath1}/icon-${item.en_name}.svg`, dealSvgFile(item.svg), 'utf-8');
            });
            break;
          case 'setLocalStorage':
            db.data.posts[message.key] = message.value;
            break;
          case 'getStorage':
            panel.webview.postMessage({ command: 'onGetStorageSuccess', data: db.data.posts[message.key] });
            break;
          case 'clearStorage':
            db.data.posts[message.key] = '';
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
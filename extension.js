const vscode = require('vscode');
const { join, dirname, resolve } = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const { removeSync, outputFile  } = require('fs-extra');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const SidebarTree = require('./configs/sidebarTree');
const { dealSvgFile } = require('./utils/svgUtils');

const adapter = new FileSync(join(__dirname,'db.json'));
const db = low(adapter);

db.data = { posts: {} }; // 设置默认值

function activate(context) {
  vscode.window.registerTreeDataProvider('download_svg', new SidebarTree(context));

	let openSite = vscode.commands.registerCommand('download_svg.openSite', () => {
		const panel = vscode.window.createWebviewPanel(
      'webview',
      '同花顺Hxmui-Icon',
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true
      }
    );
    panel.webview.html = getWebViewContent(context, 'views/index.html');
    panel.webview.onDidReceiveMessage(
      async message => {
        switch(message.command) {
          case 'exportSvgSymbolsFile':
            const uri = await vscode.window.showSaveDialog({
              filters: {
                'Javascript': ['js']
              }
            });
            const saveDir = uri.path.split('/').slice(0, -1).join('/');
            const svgPath = `${saveDir}/svg`;
            const outPath = `${saveDir}/out`;
            console.log('svgPath', svgPath);
            console.log('outPath', outPath);
            console.log(join(__dirname, 'src/utils'));
            removeSync(svgPath);
            message.data.forEach(item => {
              outputFile(`${svgPath}/icon-${item.en_name}.svg`, dealSvgFile(item.svg), 'utf-8');
            });
            exec(`cd ${join(__dirname, 'utils')} && gulp default --svgPath ${svgPath} --outPath ${outPath}`,
              () => {
                // 移除掉svg文件夹
                removeSync(svgPath);
            });
            break;
          case 'exportSvgFile':
            const uri1 = await vscode.window.showSaveDialog({
              filters: {
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

	context.subscriptions.push(openSite);
}

function getWebViewContent(context, templatePath) {
	const resourcePath = join(context.extensionPath, templatePath);
	const dirPath = dirname(resourcePath);
	let html = fs.readFileSync(resourcePath, 'utf-8');
    html = html.replace(/(<link.+?href="|<script.+?src="|<img.+?src=")(.+?)"/g, (m, $1, $2) => {
		if($2.indexOf("https://")<0)return $1 + vscode.Uri.file(resolve(dirPath, $2)).with({ scheme: 'vscode-resource' }).toString() + '"';
		else return $1 + $2+'"';
	});
	return html;
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}

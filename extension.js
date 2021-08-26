const vscode = require('vscode');
const fs = require('fs'); 
const gulp = require('gulp');
const svgSymbols = require('gulp-svg-symbols');
const svgSymbols2js = require('gulp-svg-symbols2js');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const SidebarTree = require('./configs/sidebarTree');
const { join, dirname, resolve, sep } = require('path');
const { removeSync, outputFile } = require('fs-extra');
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
            const saveDir = uri.fsPath.split(sep).slice(0, -1).join(sep);
            const svgPath = join(saveDir, 'svg');
            const outPath = join(saveDir, 'out');
            generateSvgFolders(svgPath, message.data).then(() => {
              setTimeout(() => {
                genSvgSymbolsJs(svgPath, outPath, () => {
                  removeSync(svgPath);
                });
              }, 10);
            });
            break;
          case 'exportSvgFile':
            const uri1 = await vscode.window.showSaveDialog({
              filters: {
                'Javascript': ['js']
              }
            });
            const saveDir1 = uri1.fsPath.split(sep).slice(0, -1).join(sep);
            const svgPath1 = join(saveDir1, 'svg');
            generateSvgFolders(svgPath1, message.data, false);
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

function genSvgSymbolsJs(svgPath, outPath, callback = () => {}) {
  removeSync(outPath);
  return gulp
    .src(`${svgPath}/*.svg`)
    .pipe(svgSymbols())
    .pipe(svgSymbols2js())
    .pipe(gulp.dest(`${outPath}`))
    .on('end', () => { callback() })
}


function generateSvgFolders(svgPath, dataArr, useIconPrefix = true) {
  return new Promise((resolve) => {
    removeSync(svgPath);
    dataArr.forEach(item => {
      outputFile(join(svgPath, useIconPrefix ? `icon-${item.en_name}.svg` : `${item.en_name}.svg`), dealSvgFile(item.svg), 'utf-8');
    });
    resolve(true);
  })
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

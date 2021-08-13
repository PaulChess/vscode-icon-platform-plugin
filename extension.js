const vscode = require('vscode');
const SidebarTree = require('./configs/sidebarTree');

function activate(context) {
  vscode.window.registerTreeDataProvider('download_svg', new SidebarTree(context));

	let openSite = vscode.commands.registerCommand('download_svg.openSite', () => {
		vscode.window.showInformationMessage('Hello World from hxm-vscode-icon-download!');
	});

	context.subscriptions.push(openSite);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}

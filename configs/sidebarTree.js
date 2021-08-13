const vscode = require('vscode');
const os = require('os');
const path = require('path');

class SideBarTree {
  constructor(context) {
    this.context = context;
    this.userRoot = os.homedir();
    this._onDidChangeTreeData = new vscode.EventEmitter();
    this.onDidChangeTreeData = this._onDidChangeTreeData.event;
  }
  getTreeItem(element) {
    return element;
  }
  getChildren() {
    const r_cates = [
      {
        title: '首页',
        icon: 'sideIcon.svg'
      }
    ];
    const fin_items = [];
    for (let i = 0; i < r_cates.length; i++) {
      const item = r_cates[i];
      fin_items.push(
        new DataItem(
          item.title,
          item.icon,
          '',
          {
            command: 'download_svg.openSite',
            title: '',
            arguments: [item]
          }
        )
      )
    }
    return fin_items;
  }
}

class DataItem extends vscode.TreeItem{
  constructor(label, icon, tooltip, command) {
    super(label,  vscode.TreeItemCollapsibleState.None);
    this.tooltip = tooltip;
    this.iconPath = path.join(__filename,'../../','resources', icon);
    console.log(this.iconPath);
    this.command = command;
  }
}

module.exports = SideBarTree;
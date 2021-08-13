import * as vscode from 'vscode';
import { join } from 'path';

// 树节点
class EntryItem extends vscode.TreeItem {}

//树的内容组织管理
export class EntryList implements vscode.TreeDataProvider<EntryItem> {
  onDidChangeTreeData?: vscode.Event<void | EntryItem | null | undefined> | undefined;

  getTreeItem(element: EntryItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;
  }

  getChildren(element?: EntryItem): vscode.ProviderResult<EntryItem[]> {
    const children = [];
    const item = {
      title: 'DownloadSvg',
      icon: 'sideIcon.svg',
    };

    children[0] = new DataItem(item.title, item.icon, '', {
      command: 'download_svg.OpenPlatform', title: '', arguments: [item]
    });
    console.log(children);
    return children;
  }
}

class DataItem extends vscode.TreeItem{
  constructor(label, icon, tooltip, command) {
    super(label, vscode.TreeItemCollapsibleState.None);
    this.tooltip = tooltip;
    this.iconPath = join(__dirname, 'src/resources', icon);
    this.command = command;
  }
}
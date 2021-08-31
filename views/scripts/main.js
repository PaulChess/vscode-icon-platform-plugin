// storage key
const CHOOSED_LIST_STORAGE_KEY = 'hxm-icon-platform-choosed-list';
const SEARCH_LIST_STORAGE_KEY = 'hxm-icon-platform-search-list';
const DEPARTMENT_NO_STORAGE_KEY = 'hxm-icon-platform-department-no';

let id = 0;

// Api
const searchUrl = 'http://arsenal.myhexin.com/resource/api/icon/search';
const departmentUrl = 'http://arsenal.myhexin.com/resource/api/project/search';

// TODO: 这里的部门列表暂时写死，后面需要替换成接口获取
const departmentList = [
  {id: 1, name: "猎金"},
  {id: 2, name: "iFinD"},
  {id: 3, name: "PC统一版"},
  {id: 4, name: "手炒"},
  {id: 5, name: "爱基金"},
  {id: 7, name: "自动化营销平台"},
  {id: 8, name: "保险"},
  {id: 9, name: "港美通"},
  {id: 10, name: "问财"},
  {id: 11, name: "学投资"},
  {id: 12, name: "私募"},
  {id: 13, name: "期货通PC"},
  {id: 14, name: "产品中台"},
  {id: 15, name: "马良"},
  {id: 16, name: "同花顺iPad端"}
];

const vscode = acquireVsCodeApi();

function setLocalStorage(k,v) {
  vscode.postMessage({
    command: 'setLocalStorage',
    key: k,
    value: v
  });
}

function getStorage(key,params){
  function onMessage(event){
    const message = event.data;
    if (message.command === 'onGetStorageSuccess') {
      if (params.success) {
        params.success(message.data);
      }
    }
    window.removeEventListener('message',onMessage);
  }
  window.addEventListener('message',onMessage);
  vscode.postMessage({
    command: 'getStorage',
    key: key
  });
}

function clearStorage(k) {
  vscode.postMessage({
    command: 'clearStorage',
    key: k,
  });
}

function dealSvgFile(svg) {
  id++;
  return svg.replace(/id="/g, `id="${id}-`).replace(/xlink:href="#/g, `xlink:href="#${id}-`).replace(/filter="url\(#/g, `filter="url(#${id}-`).replace(/fill="url\(#/g, `fill="url(#${id}-`);
}

function isTrueArray(arr) {
  return Array.isArray(arr) && arr.length > 0;
}

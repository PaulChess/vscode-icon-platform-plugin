// storage key
const CHOOSED_LIST_STORAGE_KEY = 'hxm-icon-platform-choosed-list';
const SEARCH_LIST_STORAGE_KEY = 'hxm-icon-platform-search-list';
const DEPARTMENT_NO_STORAGE_KEY = 'hxm-icon-platform-department-no';

// Api
const searchUrl = 'https://datav.iwencai.com/resource/api/icon/search';
const departmentUrl = 'https://datav.iwencai.com/resource/api/project/search';

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

function isTrueArray(arr) {
  return Array.isArray(arr) && arr.length > 0;
}

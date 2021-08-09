import { join } from "path";
import { ExtensionContext, Uri, Webview } from "vscode";
import * as fs from 'fs';

function isRemoteLink(link: string) {
  return /^(https?|vscode-webview-resource|javascript):/.test(link);
}

export function formatHTMLWebviewResourcesUrl(
  html: string,
  conversionUrlFn: (link: string) => string
) {
  const linkRegexp = /\s?(?:src|href)=('|")(.*?)\1/gi;
  let matcher = linkRegexp.exec(html);

  while (matcher) {
    const origin = matcher[0];
    const originLen = origin.length;
    const link = matcher[2];
    if (!isRemoteLink(link)) {
      let resourceLink = link;
      try {
        resourceLink = conversionUrlFn(link);
        html =
          html.substring(0, matcher.index) +
          origin.replace(link, resourceLink) +
          html.substring(matcher.index + originLen);
      } catch (err) {
        console.error(err);
      }
    }
    matcher = linkRegexp.exec(html);
  }
  return html;
}

export function getTemplateFileContent(
  context: ExtensionContext,
  tplPaths: string | string[],
  webview: Webview
) {
  if (!Array.isArray(tplPaths)) {
    tplPaths = [tplPaths];
  }
  const tplPath = join(context.extensionPath, 'src/views', ...tplPaths);
  const html = fs.readFileSync(tplPath, 'utf-8');
  const extensionUri = context.extensionUri;
  const dirUri = tplPaths.slice(0, -1).join('/');
  return formatHTMLWebviewResourcesUrl(html, (link) => {
    return webview
      .asWebviewUri(Uri.parse([extensionUri, 'src/views', dirUri, link].join('/')))
      .toString();
  });
}
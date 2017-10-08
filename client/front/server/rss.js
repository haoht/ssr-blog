/**
 * Created by unsad on 2017/10/8.
 */
let { siteUrl, title, description } = require('./config');

let head = `<rss xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
  <channel>
    <title>${title}</title>
    <link>${siteUrl}</link>
    <description>${description}</description>
    <atom:link href="${siteUrl}/rss.html" rel="self"/>
    <language>zh-cn</language>\r\n`

let getUpdatedDate = date => `<lastBuildDate>${date}</lastBuildDate>\r\n`

let tail = `  </channel>
</rss>`

let api = 'localhost:3000/api/post?conditions={"type":0}&select={"pathName":1,"updatedAt":1,"content":1,"title":1}&sort=1&limit=10'

let getRssBodyFromBody = result => {
  let res = result.body;
  let body = res.reduce((prev, curr)=>{
    let date = new Date(curr.updatedAt).toUTCString()
    let content = curr.content.replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')
    prev += `    <item>\r\n`;
    prev += `      <title>${curr.title}</title>\r\n`;
    prev += `      <link>${siteUrl}/post/${curr.pathName}</link>\r\n`;
    prev += `      <description>${content}</description>\r\n`;
    prev += `      <pubDate>${date}</pubDate>\r\n`;
    prev += `      <guid>${siteUrl}/post/${curr.pathName}</guid>\r\n`;
    prev += `    </item>\r\n`;
    return prev;
  }, '');
  return head + getUpdatedDate(new Date().toUTCString()) + body + tail;
}

module.exports = {
  api,
  getRssBodyFromBody
}

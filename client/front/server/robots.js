/**
 * Created by unsad on 2017/10/8.
 */
let {siteUrl} = require('./config');

module.exports =
  `User-agent: *
  Disallow: /beacon
  Disallow: /beacon.html
  Disallow: /search
  Disallow: /search.html
  Allow: /
  Sitemap: ${siteUrl}/sitemap.xml
  
  User-agent: MJ12bot
  Disallow: /`

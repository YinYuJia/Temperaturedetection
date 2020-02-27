/**
 * 生产环境
 */
;(function () {
  window.SITE_CONFIG = {};

  // api接口请求地址
  //10.10.17.16
  window.SITE_CONFIG['baseUrl'] = 'http://192.168.0.185:8082/health_body';
  // window.SITE_CONFIG['baseUrl'] = 'http://z2r5819973.qicp.vip:20718/ddkj';

  // cdn地址 = 域名 + 版本号
  window.SITE_CONFIG['domain']  = './'; // 域名
  window.SITE_CONFIG['version'] = '';   // 版本号(年月日时分)
  window.SITE_CONFIG['cdnUrl']  = window.SITE_CONFIG.domain + window.SITE_CONFIG.version
  window.SITE_CONFIG['appName'] = ''
})();

/**
 * 触控用户系统支付模块
 */

var qs = require('querystring');
var OrderNotify = require('./notify.class');

function Coco(conf) {
    //default config
    this.conf = conf;
    
    this.notify = new OrderNotify(this.conf);
}

module.exports = Qihoo;

/**
 * 生成通用订单对象
 */
Coco.prototype.createOrder = function(packet) {
    var paytime = Math.floor(Date.parse(packet.pay_time) / 1000);
    return {
        'appid' : packet.appid,
        'ditch' : 'coco',
        'ditchid' : packet.coco,
        'cost' : packet.coins,
        'payid' : packet.expand_info_01,
        'paytime' : paytime,
        'orderid' : packet.transaction_id
    };
};

/**
 * 校验支付服务商订单完成通知请求
 * @param {String} remoteip 服务商请求远程地址
 * @param {String} reqdata 服务商请求内容
 * @param {Function} callback 返回给服务商数据的回调函数，接收一个字符串参数
 * @param {Function} endcb 返回给逻辑层的回调函数，接收一个布尔值及其它附加参数
 */
Coco.prototype.verifyNotify = function(remoteip, reqdata, callback, endcb) {
    var packet = qs.parse(reqdata);
    var verify = this.notify.verify(packet);
    var order = this.createOrder(packet);
    if (verify) {
        endcb(true, order);
        callback('{"status":"ok"}');
    } else {
        endcb(false, order);
        callback('{"status":"failure"}');
    }
};

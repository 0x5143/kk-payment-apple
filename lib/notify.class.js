/**
 * 支付订单通知处理类
 * 
 * @author <a href="qingcheng.huang@chukong-inc.com">Neil</a>
 * @since 2013.08.23
 */

var fparams = require('./params.func');
var fmd5 = require('./md5.func');

var OrderNotify = function(conf) {
    this.arrNotJoinSignArgNameList = ['sign'];
    this.appid = conf.appid; //应用唯一编号
    this.secret = conf.secret; //应用密钥
    this.debug = conf.debug; //是否开启调试
};

module.exports = OrderNotify;

/**
 * 调试日志
 */
OrderNotify.prototype.logfile = function(formator) {
    if (this.debug) {
        console.log.apply(null, arguments);
    }
};

OrderNotify.prototype.checkParamsSignVerify = function(params, sign) {
    //去除空值和不参与签名的参数
    var params_filter = fparams.doParamFilter(params, this.arrNotJoinSignArgNameList, true);
    
    //排序签名参数数组
    var param_sort = fparams.doArgSort(params_filter);
    
    //把数组所有元素的
    var prestr = fparams.createLinkStringWithUrlencode(param_sort);
    
    return fmd5.md5Verify(prestr, sign, this.secret, '&');
};

/**
 * 验证支付订单通知消息是否正确
 * @param {JSON} params 请求参数对象
 * @return {Boolean} 请求消息包是否完整
 */
OrderNotify.prototype.verify = function(params) {
    if (this.appid !== params.appid) {
        return false;
    }
    
    if (params.status !== 1) {
        return false;
    }
    
    var isSignVerify = this.checkParamsSignVerify(params, params.sign);
    if (!isSignVerify) {
        return false;
    }
    
    return true;
};

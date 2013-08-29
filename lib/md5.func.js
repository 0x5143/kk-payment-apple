/**
 * MD5相关接口集
 *
 * @author <a href="qingcheng.huang@chukong-inc.com">Neil</a>
 * @since 2013.08.23
 */

var crypto = require('crypto');

/**
 * 签名字符串
 * @param {String} prestr 需要签名的字符串
 * @param {String} secret 私钥
 * @param {String} separator 私钥与待签名字符串之间是否需要连接符，默认为空字符串
 * @return {String} 签名结果字符串
 */
exports.md5Sign = function(prestr, secret, separator) {
    separator = separator || '';
    prestr += (separator + secret);
    return crypto.createHash('md5').update(prestr, 'utf8').digest("hex");
};

/**
 * 验证签名
 * @param {String} prestr 需要签名的字符串
 * @param {String} sign 签名结果
 * @param {String} secret 私钥
 * @param {String} separator 私钥与待签名字符串之间是否需要连接符，默认为空字符串
 * @return {Boolean} 是否通过验证
 */
exports.md5Verify = function(prestr, sign, secret, separator) {
    separator = separator || '';
    prestr += (separator + secret);
    var mysign = crypto.createHash('md5').update(prestr).digest('hex');
    return (mysign === sign);
};

/*
* @Author: wuzitao
* @Date:   2017-08-12 14:46:56
* @Last Modified time: 2017-08-31 17:08:10
*/
const crypto = require('crypto')

function encryptHash (method, text) {
	let cry = crypto.createHash(method)
  cry.update(text)
  return cry.digest('hex')
}

function encrypt (method, text) {
	let cry = crypto.createCipher(method, '9853e61272b549ad1e6371894ade20f2')
	let crypted = cry.update(text, 'utf8', 'hex')
	return crypted + cry.final('hex')
}

function decrypt (method, text) {
	let decipher = crypto.createDecipher(method, '9853e61272b549ad1e6371894ade20f2')
	let dec = decipher.update(text, 'hex', 'utf8')
	return dec + decipher.final('utf8')
}

function md5 (text) {
  return encryptHash('md5', text)
}

function aes (text) {
	// return encrypt('aes-256-ecb', text)
	return text
}

function deaes (text) {
	// return decrypt('aes-256-ecb', text)
	return text
}

module.exports = { md5, aes, deaes }
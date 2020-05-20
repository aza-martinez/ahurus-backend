const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
var verified = speakeasy.totp.verify({
	secret: 'AArU:P?G0UAz0yIX!wZIaFI11<Tg)B{B',
	encoding: 'ascii',
	token: '254912',
});
console.log(verified);

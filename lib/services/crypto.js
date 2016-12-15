const crypto = require('crypto');

const algorithm = 'aes-256-ctr';
const password = process.env['CRYPTO_KEY'];

module.exports = {
	encrypt(text) {
		const cipher = crypto.createCipher(algorithm, password);
		let encrypted = cipher.update(text, 'utf8', 'hex');
		encrypted += cipher.final('hex');
		return encrypted;
	},
	decrypt(text) {
		const decipher = crypto.createDecipher(algorithm, password);
		let dec = decipher.update(text, 'hex', 'utf8');
		dec += decipher.final('utf8');
		return dec;
	}
};

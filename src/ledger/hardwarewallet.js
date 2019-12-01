const LedgerWallet = require("../hardware/LedgerWallet");

const hardwareTypes = [
	{name:'Ledger', blockchains:LedgerWallet.availableBlockchains()},
]

const getHardwareKey = async (blockchain, index) => {
	if(!(await LedgerWallet.setup()))
		return {error:`Can't connect to ledger device`};


	const ledger = new LedgerWallet(blockchain);
	await ledger.open();

	return ledger.getAddress(index)
};

const signWithHardware = async (keypair, network, publicKey, payload, arbitrary = false, isHash = false) => {
	const {blockchain} = network;

	if(!(await LedgerWallet.setup()))
		return {error:`Can't connect to ledger device`};


	const ledger = new LedgerWallet(blockchain);
	await ledger.open();

	return new Promise(r => setTimeout(async () => {
		if(!(await ledger.canConnect())) return {error:`cant_connect`};
		ledger.setAddressIndex(keypair.external.addressIndex);
		r(await ledger.sign(publicKey, payload, payload.abi, network));
	}, 100));
}

/* FOR REFERENCE
  const sign = async (network, publicKey, payload, arbitrary = false, isHash = false) => {
    try {
      const plugin = plugins[network.blockchain];
      if(!plugin) return false;

      const keypair = getKeypair(publicKey, network.blockchain);
      if(!keypair) return Error.signatureError('no_keypair', 'This keypair could not be found');

      if(keypair.external) return signWithHardware(keypair, network, publicKey, payload, arbitrary, isHash);

      const privateKey = await getPrivateKeyForSigning(keypair.id, network.blockchain);

      return plugin.signer(payload, publicKey, arbitrary, isHash, privateKey);
    } catch(e){
      console.error('Signing Error!', e);
      return Error.signatureError('sign_err', 'There was an error signing this transaction.');
    }
  };
*/

const EXPORTS = {
	hardwareTypes,
	getHardwareKey,
}

module.exports = EXPORTS;

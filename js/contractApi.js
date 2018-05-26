const CONTRACT_ADDRESS = window.IS_MAINNET ?  "n1ion3ne6QBnQR3h3Z7PDWfGor2Yc4kxnYJ" : "n1p2hPztyaRw55qpFGWcGT1AYnsz3H4bDK8";

class SmartContractApi {
  constructor(contractAdress) {
    let NebPay = require('nebpay');
    this.nebPay = new NebPay();
    this._contractAdress = contractAdress || CONTRACT_ADDRESS;
  }

  getContractAddress() {
    return this.contractAdress;
  }

  _simulateCall({ value = "0", callArgs = "[]", callFunction , callback }) {
    this.nebPay.simulateCall(this._contractAdress, value, callFunction, callArgs, {  
        callback: window.IS_MAINNET ? require('nebpay').config.mainnetUrl : require('nebpay').config.testnetUrl,
        listener: function(resp){
            if(callback){
                callback(resp);
            }           
        }   
    });
}
  
  _call({ value = "0", callArgs = "[]", callFunction, callback }) {
    return this.nebPay.call(this._contractAdress, value, callFunction, callArgs, {
        callback: window.IS_MAINNET ? require('nebpay').config.mainnetUrl : require('nebpay').config.testnetUrl,
        listener: function(res) {
            if (callback) {
                callback(res)
            }
        }
    });
  }

  queryPayInfo(serialNumber) {
      return this.nebPay.queryPayInfo(serialNumber)
  }
}

class ProposalContractApi extends SmartContractApi {
  set(time, message, callback) {
    return this._call({
      callArgs: JSON.stringify([time, message]),
      callFunction: "setProposal",
      callback: callback
    });
  }

  get(address, callback) {
    return this._simulateCall({
      callArgs: JSON.stringify([address]),
      callFunction: "getProposal",
      callback: callback
    });
  }
}

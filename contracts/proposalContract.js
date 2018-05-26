"use strict";

function ProposalContract() {
  LocalContractStorage.defineMapProperty(this, "proposalMap", null);
  LocalContractStorage.defineProperty(this, "count");
}

ProposalContract.prototype = {
  init: function() {
  },

  setProposal: function(time, message) {
    time = time.trim()
    message = message.trim()

    if (time === "" || message  === ""){
      throw new Error("empty time and message");
    }

    let from = Blockchain.transaction.from;

    this.proposalMap.put(from, { time, message });
  },

  getProposal: function(from) {
    from = from.trim()
    let hasAddress = Blockchain.verifyAddress(from);
    if (hasAddress === 0) {
      throw new Error(`Wallet: ${from} is invaild`);
    }

    return this.proposalMap.get(from);
  }
}

module.exports = ProposalContract
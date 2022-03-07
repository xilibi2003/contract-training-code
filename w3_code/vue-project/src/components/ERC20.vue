<script>
import { ethers } from 'ethers'


export default {

  name: 'erc20',

  data() {
    return {

      recipient: null,
      amount: null,
      balance: null,

      name: null,
      decimal: null,
      symbol: null,
    }
  },

  async created() {
    await this.initAccount()
    await this.initContract()
    this.getInfo();
  },

  methods: {
    async initAccount(){
      if(window.ethereum) {
        console.log("initAccount");
        try{
          this.accounts = await window.ethereum.enable()
          console.log("accounts:" + this.accounts);
          this.account = this.accounts[0];
          this.provider = window.ethereum;

          this.signer = new ethers.providers.Web3Provider(this.provider).getSigner()
          this.chainId = parseInt(await window.ethereum.request({ method: 'eth_chainId' }));
          console.log("chainId:" + this.chainId);
        } catch(error){
          console.log("User denied account access", error)
        }
      }else{
        console.log("Need install MetaMask")
      }
    },

    async initContract() {
      const addr = require(`../../deployments/${this.chainId}/${ContractName}.json`);
      const abi = require(`../../deployments/abi/${ContractName}.json`);
    }, 

    getInfo() {

    }
  }




}


</script>

<template>
  <div >
      <div>
        balance of account
        <input type="text" :value="balance" />
        <br />balance inquiry
        <!-- 类型 input 改成了 button -->
        <input type="button" value="get balance" @click="getbalance()" class="btn btn-block"/>
        <br />target address
        <input type="text" v-model="recipient" />
        <br />transfer Amount
        <input type="text" v-model="amount" />
        <br />
        <input type="button" value="transfer" @click="transfer()" class="btn btn-block"/>
      </div>

      <div>
        <br />name
        <input type="text" :value="name" />
        <br />symbol
        <input type="text" :value="symbol" />
        <br />decimal
        <input type="text" :value="decimal" />
      </div>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>

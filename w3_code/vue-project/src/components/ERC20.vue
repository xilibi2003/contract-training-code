<script>
import { ethers } from 'ethers'

import erc20Addr from '../../../deployments/dev/MyERC20.json'
import erc20Abi from '../../../deployments/abi/MyERC20.json'

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
      supply: null,
    }
  },

  async created() {
    await this.initAccount()
    this.initContract()
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
          // this.chainId = parseInt(await window.ethereum.request({ method: 'eth_chainId' }));
          // console.log("chainId:" + this.chainId);
        } catch(error){
          console.log("User denied account access", error)
        }
      }else{
        console.log("Need install MetaMask")
      }
    },

    async initContract() {
      this.erc20Token = new ethers.Contract(erc20Addr.address, 
        erc20Abi, this.signer);
    }, 

    getInfo() {
      this.erc20Token.name().then((r) => {
        this.name = r;
      })
      this.erc20Token.decimals().then((r) => {
        this.decimal = r;
      })
      this.erc20Token.symbol().then((r) => {
        this.symbol = r;
      })
      this.erc20Token.totalSupply().then((r) => {
        this.supply = ethers.utils.formatUnits(r, 18);
      })

      this.erc20Token.balanceOf(this.account).then((r) => {
        this.balance = ethers.utils.formatUnits(r, 18);
      })
    },

    transfer() {
      let amount = ethers.utils.parseUnits(this.amount, 18);
      this.erc20Token.transfer(this.recipient, amount).then((r) => {
        console.log(r);  // 返回值不是true
        this.getInfo();
      })
    }
  }
}


</script>

<template>
  <div >

      <div>
        <br /> Token名称 : {{ name  }}
        <br /> Token符号 : {{  symbol }}
        <br /> Token精度 : {{  decimal }}
        <br /> Token发行量 : {{  supply }}
        <br /> 我的余额 : {{ balance  }}
      </div>

      <div>
        <br />转账到:
        <input type="text" v-model="recipient" />
        <br />转账金额
        <input type="text" v-model="amount" />
        <br />
        <button @click="transfer()"> 转账 </button>
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

div {
  font-size: 1.2rem;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>

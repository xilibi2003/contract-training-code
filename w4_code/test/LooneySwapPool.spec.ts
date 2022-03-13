import { expect, use } from 'chai'
import { solidity } from 'ethereum-waffle'
import { ethers } from 'hardhat'
import { Token } from '../typechain/Token'
import { LooneySwapPool } from '../typechain/LooneySwapPool'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'

use(solidity)

describe("LooneySwapPool", function() {
  let eth: Token
  let dai: Token
  let pool: LooneySwapPool
  let accounts: SignerWithAddress[]

  beforeEach(async () => {
    accounts = await ethers.getSigners()

    const Token = await ethers.getContractFactory('Token')
    eth = await Token.deploy('Ethereum', 'ETH', 100000000000) as Token
    dai = await Token.deploy('DAI', 'DAI', 1000000000000000) as Token
    await eth.deployed()
    await dai.deployed()

    const [, account1, account2, account3, account4] = accounts

    for (const account of [account1, account2, account3, account4]) {
      await (await eth.transfer(account.address, 200)).wait()
      await (await dai.transfer(account.address, 10000000)).wait()
    }

    const LooneySwapPool = await ethers.getContractFactory("LooneySwapPool")
    pool = await LooneySwapPool.deploy(eth.address, dai.address) as LooneySwapPool
    await pool.deployed()
  })

  it("Should return initialized pool", async function() {
    expect(await pool.token0()).to.equal(eth.address)
    expect(await pool.token1()).to.equal(dai.address)
    expect(await pool.reserve0()).to.equal(0)
    expect(await pool.reserve1()).to.equal(0)
  })

  it("Should add initial liquidity to reserves", async function() {
    await (await eth.connect(accounts[1]).approve(pool.address, 1)).wait()
    await (await dai.connect(accounts[1]).approve(pool.address, 2000)).wait()
    await (await pool.connect(accounts[1]).add(1, 2000)).wait()

    expect(await pool.reserve0()).to.equal(1)
    expect(await pool.reserve1()).to.equal(2000)
    expect(await pool.totalSupply()).to.equal(100000) // Initial Supply
    expect(await pool.balanceOf(accounts[1].address)).to.equal(100000)
  })

  it("Should mint correct amount", async function() {
    await (await eth.connect(accounts[1]).approve(pool.address, 1)).wait()
    await (await dai.connect(accounts[1]).approve(pool.address, 2000)).wait()
    await (await pool.connect(accounts[1]).add(1, 2000)).wait()

    await (await eth.connect(accounts[2]).approve(pool.address, 3)).wait()
    await (await dai.connect(accounts[2]).approve(pool.address, 6000)).wait()
    await (await pool.connect(accounts[2]).add(3, 6000)).wait()

    expect(await pool.reserve0()).to.equal(4)
    expect(await pool.reserve1()).to.equal(8000)
    expect(await pool.totalSupply()).to.equal(400000)

    expect(await pool.balanceOf(accounts[1].address)).to.equal(100000)
    expect(await pool.balanceOf(accounts[2].address)).to.equal(300000)
  })

  it("Should burn correct amount", async function() {
    await (await eth.connect(accounts[1]).approve(pool.address, 1)).wait()
    await (await dai.connect(accounts[1]).approve(pool.address, 2000)).wait()
    await (await pool.connect(accounts[1]).add(1, 2000)).wait()

    await (await eth.connect(accounts[2]).approve(pool.address, 3)).wait()
    await (await dai.connect(accounts[2]).approve(pool.address, 6000)).wait()
    await (await pool.connect(accounts[2]).add(3, 6000)).wait()

    const ethBalanceBefore = await eth.balanceOf(accounts[1].address)
    const daiBalanceBefore = await dai.balanceOf(accounts[1].address)

    const lpTokens = await pool.balanceOf(accounts[1].address)
    await (await pool.connect(accounts[1]).remove(lpTokens)).wait()

    expect(await eth.balanceOf(accounts[1].address)).to.equal(ethBalanceBefore.add(1))
    expect(await dai.balanceOf(accounts[1].address)).to.equal(daiBalanceBefore.add(2000))

    expect(await pool.reserve0()).to.equal(3)
    expect(await pool.reserve1()).to.equal(6000)
    expect(await pool.totalSupply()).to.equal(300000)
    expect(await pool.balanceOf(accounts[1].address)).to.equal(0)
  })

  it("Should return correct output amount for dai", async function() {
    await (await eth.connect(accounts[1]).approve(pool.address, 5)).wait()
    await (await dai.connect(accounts[1]).approve(pool.address, 10000)).wait()
    await (await pool.connect(accounts[1]).add(5, 10000)).wait()

    const [amountOut, reserve0, reserve1] = await pool.getAmountOut(1, eth.address)
    expect(amountOut).to.equal(1667)
    expect(reserve0).to.equal(6)
    expect(reserve1).to.equal(8333)
  })

  it("Should return correct output amount for eth", async function() {
    await (await eth.connect(accounts[1]).approve(pool.address, 20)).wait()
    await (await dai.connect(accounts[1]).approve(pool.address, 40000)).wait()
    await (await pool.connect(accounts[1]).add(20, 40000)).wait()

    const [amountOut, reserve0, reserve1] = await pool.getAmountOut(6000, dai.address)
    expect(amountOut).to.equal(3)
    expect(reserve0).to.equal(17)
    expect(reserve1).to.equal(46000)
  })

  it("Should swap successfully with exact amountOut", async function() {
    await (await eth.connect(accounts[1]).approve(pool.address, 5)).wait()
    await (await dai.connect(accounts[1]).approve(pool.address, 10000)).wait()
    await (await pool.connect(accounts[1]).add(5, 10000)).wait()

    await (await eth.connect(accounts[2]).approve(pool.address, 20)).wait()
    await (await dai.connect(accounts[2]).approve(pool.address, 40000)).wait()
    await (await pool.connect(accounts[2]).add(20, 40000)).wait()

    const ethBalanceBefore = await eth.balanceOf(accounts[3].address)
    const daiBalanceBefore = await dai.balanceOf(accounts[3].address)

    const [amountOut] = await pool.getAmountOut(1, eth.address)
    await (await eth.connect(accounts[3]).approve(pool.address, amountOut)).wait
    await (await pool.connect(accounts[3]).swap(1, amountOut, eth.address, dai.address, accounts[3].address))

    expect(await eth.balanceOf(accounts[3].address)).to.equal(ethBalanceBefore.sub(1))
    expect(await dai.balanceOf(accounts[3].address)).to.equal(daiBalanceBefore.add(1924))
  })

  it("Should prevent slip when output slides", async function() {
    await (await eth.connect(accounts[1]).approve(pool.address, 20)).wait()
    await (await dai.connect(accounts[1]).approve(pool.address, 40000)).wait()
    await (await pool.connect(accounts[1]).add(20, 40000)).wait()

    const [amountOut] = await pool.getAmountOut(1, eth.address)
    await (await eth.connect(accounts[2]).approve(pool.address, amountOut)).wait
    await (await pool.connect(accounts[2]).swap(1, amountOut, eth.address, dai.address, accounts[2].address))

    await (await eth.connect(accounts[3]).approve(pool.address, amountOut)).wait
    await expect(pool.connect(accounts[3]).swap(1, amountOut, eth.address, dai.address, accounts[3].address)).to.be.revertedWith('Slipped... on a banana')
  })
})

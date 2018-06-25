const namehash = require('eth-ens-namehash').hash

const getContract = name => artifacts.require(name)
const getApp = (receipt, app, index) => { return receipt.logs.filter(l => l.event == 'InstalledApp' && l.args['appId'] == namehash(app))[index].args['appProxy'] }
const pct16 = x => new web3.BigNumber(x).times(new web3.BigNumber(10).toPower(16))

contract("TCR",  ([owner, _]) => {
  const network = 'devnet'
  let indexObj = require('../index_local.js')
  //const ENS = indexObj.networks[network].ens
  //const OWNER = indexObj.networks[network].owner
  const TCR_KIT = indexObj.networks[network].tcr_kit
  const TOKEN = indexObj.networks[network].TOKEN
  const voteQuorum = pct16(50)
  const minorityBlocSlash = pct16(40)
  const commitDuration = 300
  const revealDuration = 300
  const minDeposit = 100
  const applyStageLen = 900
  const dispensationPct = pct16(50)

  const TIME_UNIT_BLOCKS = 0
  const TIME_UNIT_SECONDS = 1

  let curation, staking, voteStaking

  before(async () => {
    const TCRKit = getContract('TCRKit').at(TCR_KIT)
    const r1 = await TCRKit.newInstance(owner, TOKEN, voteQuorum, minorityBlocSlash, commitDuration, revealDuration)
    assert.equal(r1.receipt.status, '0x1', "Transaction should succeed")
    staking = getContract('Staking').at(getApp(r1, 'staking.aragonpm.eth', 0))
    voteStaking = getContract('Staking').at(getApp(r1, 'staking.aragonpm.eth', 1))
    console.log(1)
    curation = await TCRKit.initCuration(minDeposit, applyStageLen, dispensationPct)
    console.log(2)
  })

  it('creates new application', async () => {
    const amount = 100
    const lockId = staking.lock(amount, TIME_UNIT_SECONDS, applyStageLen, curation.address, "")
    await curation.newApplication("test", lockId)
  })
})

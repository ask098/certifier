import * as constants from '@/store/constants'
import CourseContract from '@/contracts/Certifier.json'

const state = {
  provider: !!(window.web3 && window.web3.currentProvider),
  isOwner: false,
  contract: null,
  coinbase: null
}

const actions = {
  [constants.COURSE_INIT]: ({commit}) => {
    const abi = CourseContract.abi
    const contractAddress = '0xf9bbc23c9a8ac9517f2b24a6c17013acc5c6c9c5'
    const contract = web3.eth.contract(abi).at(contractAddress)
    commit(constants.COURSE_SET_CONTRACT, contract)
    web3.eth.getCoinbase((error, coinbase) => {
      if (error) console.error(error)
      commit(constants.COURSE_SET_COINBASE, coinbase)
      contract.isOwner({from: coinbase}, (error, isOwner) => {
        if (error) console.error(error)
        commit(constants.COURSE_SET_IS_OWNER, isOwner)
      })
    })
  },
  [constants.COURSE_ADD_COURSE]: ({state}, data) => {
    const {
      courseCode,
      courseName,
      courseCost,
      courseDuration,
      courseThreshold,
      codes
    } = data
    state.contract.addCourse(
      courseCode,
      courseName,
      courseCost,
      courseDuration,
      courseThreshold,
      codes,
      {from: state.coinbase},
      (error, result) => {
        if(error) console.error(error)
        console.info(result)
      }
    )
  }
}

const mutations = {
  [constants.COURSE_SET_CONTRACT]: (state, contract) => {
    state.contract = contract
  },
  [constants.COURSE_SET_COINBASE]: (state, coinbase) => {
    state.coinbase = coinbase
  },
  [constants.COURSE_SET_IS_OWNER]: (state, isOwner) => {
    state.isOwner = isOwner
  }
}

const getters = {}

export default {
  state,
  actions,
  mutations,
  getters
}
export default {
    state: {
        hidePam: [], // 超级组件中隐藏参数
        list: [] // 一个动态数组，用于存放列表中的产品id数组
    },
    mutations: {
      setHidePam (state, val) {
        state.hidePam = val
      },
      setList (state, val) {
        state.list = val
      }
    },
    getters: {},
    actions: {}
}

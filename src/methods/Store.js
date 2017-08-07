/**
 * Created by aidenZou on 16/6/14.
 */

/**
 *
 * @param key String KEY
 * @param val String VALUE
 * @param exp int 有效时间
 */

const Store = {
  set (key, val, exp) {
    window.localStorage.setItem(key, JSON.stringify({val: val, exp: exp, time: new Date().getTime()}))
  },
  get (key) {
    let data = JSON.parse(window.localStorage.getItem(key))
    if (!data) return null
    if (new Date().getTime() - data.time > data.exp) {
      return null
    }
    return data.val
  }
}

export default Store
// exports.sessionStorage = {
//   set (key, val, exp) {
//     window.sessionStorage.setItem(key, {val: val, exp: exp, time: new Date().getTime()})
//   },
//   get (key) {
//     let data = window.sessionStorage.getItem(key)
//     if (!data) return null
//     if (new Date().getTime() - data.time > data.exp) {
//       return null
//     }
//     return data.val
//   }
// }

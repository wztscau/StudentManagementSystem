const $ = require('jquery')
const toast = require('../utils/toast.min.js')
module.exports = {
  timeout: 10000,
  beforeSend () {
    $('#waiter').css('display', 'flex')
  },
  error (err) {
    const errText = err.statusText
    switch (errText.toLowerCase()) {
      case 'timeout': toast('连接超时，请稍后重试')
        break
    }
  },
  complete () {
    $('#waiter').hide()
  }
}

(function($) {
  // check jQuery
  if (!$) {
    throw new Error('jQuey is not loaded!');
  }

  Noty.overrideDefaults({
    layout: 'topCenter',
    theme: 'nest',
    closeWith: ['click', 'button']
  });

  $(window).ready(function() {
    if (typeof webExtensionWallet === 'undefined') {
      new Noty({
        type: 'error',
        text: `<div>
            请确保已安装 <a href="https://github.com/ChengOrangeJu/WebExtensionWallet">WebExtensionWallet</a>
            ,否则将无法使用该 dAPP
          </div>`
      }).show();
    }

    // get hash of url query string
    let queryObject = new URI(location.href).search(true);

    if (queryObject.hash) {
      $('body').addClass('has-msg');
      $('.message-box').removeClass('gradient-border');
      $('.app-wrapper .title').text('Receive Love')
      $('.subtitle.subtitle-1').html(`区块链已见证了来自 <strong>${queryObject.hash}</strong> 的爱情宣言`)
      $('.subtitle.subtitle-2').text('')
      $('.message-input').hide()

      let api = new ProposalContractApi()
      $('.loading').show()
      api.get(queryObject.hash, function(res) {
        if (!res.execute_err) {
          let data = JSON.parse(res.result)
          $('.message-board').html(`
          <p>发布时间: ${new Date(Number(data.time)).toLocaleString('CN')}</p>
          <p>${data.message}</p>
          `)
          $('.loading').hide()
        }
      })

      return
    } else {
      $('.app-wrapper .title').text('Send Love')
      $('.message-input').focus()

    }

    let result_tx, timer, qrCode

    $('#sendBtn').on('click', function(e) {
      // check extension again
      if (typeof webExtensionWallet === 'undefined') {
        new Noty({
          type: 'error',
          text: `<div>
              系统检测到您暂未安装 <a href="https://github.com/ChengOrangeJu/WebExtensionWallet">WebExtensionWallet</a>
              , 暂时无法使用该功能
            </div>`
        }).show();

        return;
      }

      let api = new ProposalContractApi()
      // 获取用户输入信息
      let message = $('.message-input').text()
      // 获取当前时间
      let time = new Date().getTime().toString()
      result_tx = api.set(time, message, function(res) {
        console.log('txHash:', res)
        $('.message-input').hide()
        $('.loading').show()
        $('#sendBtn').hide()
      })


      timer = setInterval(function() {
        checkTxStatus()
      }, 1000)

      function checkTxStatus() {
        api.queryPayInfo(result_tx).then(res => {
          let resObject = JSON.parse(res)
          // success
          if (resObject.code === 0) {
            // clear timer
            clearInterval(timer)
            let url = `${location.href}?hash=${resObject.data.from}`
            qrCode = new QRCode(document.getElementById('qrCode'), {
              text: url,
              width: 260,
              height: 260,
              colorDark : "#000000",
              colorLight : "#ffffff",
              correctLevel : QRCode.CorrectLevel.H
            })

            new Noty({
              type: 'success',
              text: `区块链写入数据成功！`
            }).show();

            $('.loading').hide()
            $('#qrCode').show()
            $('#qrCode').append(`<p class="result-link">扫描二维码或使用<a href="${url}">该链接</a></p>`)
          } else if (resObject.code === 1) {
            new Noty({
              type: 'error',
              text: `区块链写入数据失败，请确保钱包内有足够余额！`
            }).show();
            $('.loading').hide()
            $('#sendBtn').show()
            $('.message-input').show()
          }
        }).catch(err => {
          console.log(err)
        })
      }
    })
  });
})(window.jQuery);

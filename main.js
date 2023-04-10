let startObserve = false;

let messageListButton = document.querySelector(
  'button[aria-label="與所有參與者進行即時通訊"]'
);

messageListButton.onclick = () => {
  if (!startObserve) {
    setTimeout(() => {
      startObserve = true;
      run();
    }, 500);
  }
};

const run = () => {
  // add custom style
  let style = document.createElement("style");
  style.appendChild(
    document.createTextNode(`
            .hide{
                display: none;
            }
            .controller{
                right: 10px;
                top: 10px;
                position: fixed;
                z-index: 999999999; 
                padding: 8px 18px 10px;
                font-size: 16px;
                line-height: normal;
                border-radius: 20px;
                border: 0;
                background: rgb(234,67,53);
                color: white;
                cursor: pointer;
            }
            .controller.close{
                background: rgb(60,64,67);
            }
            .flying-text{
                position: fixed;
                z-index: 10000;
                left: 100vw;
                color: black;
                -webkit-text-stroke: 2px;
                -webkit-text-stroke-color: white;
                font-weight: 700;
                font-size: 40px;
                white-space: nowrap;
                animation: flythrough 10s linear
            }
            @keyframes flythrough {
                from {transform: translateX(0);}
                to {transform: translateX(-150vw);}
            }
            `)
  );
  document.body.appendChild(style);

  // add observeDom function
  var observeDOM = (() => {
    return function (obj, callback) {
      if (!obj || obj.nodeType !== 1) return;

      var mutationObserver = new MutationObserver(callback);

      // have the observer observe foo for changes in children
      mutationObserver.observe(obj, { childList: true, subtree: true });
      return mutationObserver;
    };
  })();

  // 抓取 meet 內的訊息框
  let messagesList = document.querySelector("div[aria-live='polite']");

  // add flying text group
  let flyingTextGroup = document.createElement("div");
  document.body.appendChild(flyingTextGroup);

  // 監聽 mutation
  observeDOM(messagesList, (m) => {
    // 抓取一次回傳兩個 record 的 值
    if (m.length > 1) return;

    let ele = m[m.length - 1];
    let textContent;

    if (ele.addedNodes[0].childNodes.length > 1) {
      // 如果是一個新的 message group, 則會回傳兩個 element 包含對象名稱和時間
      // 因此只要抓後者即可
      textContent = ele.addedNodes[0].childNodes[1].innerText;
    } else {
      textContent = ele.addedNodes[0].innerText;
    }

    let flyingText = document.createElement("div");

    const verticalPos = () => {
      let num = Math.floor(Math.random() * 100);
      while (num > 30 && num < 70) {
        num = Math.floor(Math.random() * 100);
      }
      return num;
    };

    flyingText.textContent = textContent;
    flyingText.style.top = `${verticalPos()}vh`;
    flyingText.style.animation = `flythrough ${
      9 + Math.floor(Math.random() * 3)
    }s linear`;
    flyingText.className = "flying-text";
    flyingTextGroup.appendChild(flyingText);
  });

  // add controllers
  let controller = document.createElement("button");
  controller.toggle = true;
  controller.textContent = "關閉字幕";
  controller.className = "controller";
  document.body.appendChild(controller);
  controller.addEventListener("click", (e) => {
    if (e.target.toggle) {
      e.target.toggle = false;
      controller.textContent = "開啟字幕";
    } else {
      e.target.toggle = true;
      controller.textContent = "關閉字幕";
    }
    controller.classList.toggle("close");
    flyingTextGroup.classList.toggle("hide");
  });
};

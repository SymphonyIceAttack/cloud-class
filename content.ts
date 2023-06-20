import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["https://*.mosoteach.cn/*"],
  all_frames: true,
  css: ["index.css"]
}

window.addEventListener("load", () => {
  // 调用函数以启动MutationObserver
  configureMutationObserver()
  checkIfShouldApplyShadow() && applyShadowToExperienceSpans()

  creatSorceButton()
})

function configureMutationObserver() {
  let observer = new MutationObserver(function (mutationsList, observer) {
    handleMutations(mutationsList)
  })

  function handleMutations(mutationsList) {
    mutationsList.forEach(function (mutation) {
      if (mutation.type === "childList") {
        handleAddedNodes(mutation.addedNodes)
      }
    })
  }

  function handleAddedNodes(nodes) {
    nodes.forEach(function (node) {
      if (node.tagName === "VIDEO") {
        setTimeout(function () {
          node.playbackRate = 16
        }, 2000)
      } else if (node.childNodes && node.childNodes.length > 0) {
        handleAddedNodes(node.childNodes)
      }
    })
  }

  let observerConfig = { childList: true, subtree: true }
  observer.observe(document, observerConfig)
}

function applyShadowToExperienceSpans() {
  let imgs = document.getElementsByTagName("img")

  for (let i = 0; i < imgs.length; i++) {
    if (
      imgs[i].src ==
      "https://static-cdn-oss.mosoteach.cn/mosoteach2/common/images/activities-list-icon-assignment.png"
    ) {
      let siblingImgs = (
        imgs[i].parentNode as HTMLBaseElement
      ).getElementsByTagName("span")

      let foundParticipated = false

      for (let j = 0; j < siblingImgs.length; j++) {
        if (siblingImgs[j].textContent.includes("已参与")) {
          foundParticipated = true
          break
        }
      }

      if (!foundParticipated) {
        ;(imgs[i].parentNode as HTMLBaseElement).style.boxShadow =
          "inset 0 0 5px 5px rgba(255, 0, 0, 0.5)"
      }
    }
  }
}

function checkIfShouldApplyShadow() {
  let aTags = document.getElementsByTagName("a")

  for (let i = 0; i < aTags.length; i++) {
    let activitySpan = aTags[i].querySelector("span.fontsize-14")
    let countSpan = aTags[i].querySelector("span.fontsize-12")

    if (
      activitySpan &&
      activitySpan.textContent === "活动" &&
      countSpan &&
      /\(\d+\)/.test(countSpan.textContent) &&
      getComputedStyle(aTags[i]).borderBottomStyle !== "none"
    ) {
      return true
    }
  }

  return false
}

function openSpanMenu() {
  // 获取页面中的所有<span>元素
  let spanElements = document.getElementsByTagName("span")

  // 迭代遍历每个<span>元素
  for (let i = 0; i < spanElements.length; i++) {
    let spanElement = spanElements[i]

    // 检查<span>元素是否具有所需的属性和类
    let appraiseStatus = spanElement.getAttribute("data-appraise-status")
    let classNames = spanElement.getAttribute("class")

    // 检查前一个<span>元素的内容是否为"请评分"
    if (i > 0 && spanElements[i - 1].textContent.trim() === "请评分") {
      // 执行相应的点击操作
      spanElement.click()
    }
  }

  // 获取滚动条所在的元素，通常是<body>或者指定的容器元素
  let container = document.documentElement || document.body

  // 将滚动条滚动到底部
  container.scrollTop = container.scrollHeight
}
function clickButtonPeriodically() {
  // 获取页面中的所有<li>元素
  let liElements = document.getElementsByTagName("li")

  // 迭代遍历每个<li>元素
  for (let i = 0; i < liElements.length; i++) {
    let liElement = liElements[i]

    // 检查<li>元素的文本内容是否包含满分
    let liText = liElement.textContent

    if (liText.includes("满分")) {
      // 触发点击事件
      liElement.click()
    }
  }

  // 使用querySelector选择符合条件的按钮元素
  let buttonElement = document.querySelector(
    'button#score[data-event="enter"].button-big.ensure-score'
  ) as HTMLButtonElement

  // 触发点击事件
  if (buttonElement) {
    buttonElement.click()
  }
}
function creatSorceButton() {
  // 创建按钮元素
  let button = document.createElement("button")
  button.className = "rating-button"
  button.textContent = "一键评分"

  // 添加按钮到容器中
  document.body.appendChild(button)

  // 添加点击事件处理程序
  button.addEventListener("click", function () {
    setTimeout(() => {
      openSpanMenu()
      setInterval(() => {
        clickButtonPeriodically()
      }, 1000)
    }, 3000)
  })
}

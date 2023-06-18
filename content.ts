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
        ;(
          imgs[i].parentNode as HTMLBaseElement
        ).style.boxShadow = "inset 0 0 5px 5px rgba(255, 0, 0, 0.5)"
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

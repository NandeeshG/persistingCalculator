//---- Sidebar script
var toggleSidebar = function () {
    showSidebar = !showSidebar
    Sidebar.style.display = showSidebar ? 'block' : 'none'
    questionMark.innerHTML = showSidebar ? 'x' : '?'
}
let showSidebar = true
toggleSidebar()
window.onload = function (e) {
    questionMark.style.animationName = 'highlight'
    questionMark.style.animationDuration = '2s'
    questionMark.style.animationIterationCount = '2'
}
questionMark.addEventListener('animationend', (e) => {
    e.target.style.animationName = ''
})

//---- Copy button
COPY_BTN.addEventListener('animationend', (e) => {
    e.target.style.animationName = ''
})
var copyAns = function () {
    var copyText = ANSF.innerText
    navigator.clipboard.writeText(copyText).then(
        function (e) {
            if (ENV === 'DEV') console.log('Copy successful', e)
            COPY_BTN.style.animationName = 'copyHighlight'
            COPY_BTN.style.animationDuration = '0.8s'
        },
        function (e) {
            if (ENV === 'DEV') console.log('Copy failed', e)
        }
    )
}

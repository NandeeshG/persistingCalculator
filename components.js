//---- Sidebar script
const Sidebar = document.getElementById('INFO')
const questionMark = document.getElementById('QSTMARK')
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

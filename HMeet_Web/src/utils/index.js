let timeout = null
function debounce(fn, wait = 1000) {
    if (timeout !== null) clearTimeout(timeout)
    timeout = setTimeout(fn, wait)
}
export default debounce
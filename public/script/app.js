const openDeleteModalBtn = document.querySelector('#open-delete-modal')
const deleteModalEl = document.querySelector('#delete-modal')
const cancelDeleteBtn = document.querySelector('#cancel-delete')

if (openDeleteModalBtn && deleteModalEl && cancelDeleteBtn) {
const toggleDeleteModal = (e) => {
    deleteModalEl.classList.toggle('show')
}

openDeleteModalBtn.addEventListener('click', toggleDeleteModal)
cancelDeleteBtn.addEventListener('click', toggleDeleteModal)
}

const hamMenu = document.querySelector('.ham-menu')
const offScreenMenu = document.querySelector('.off-screen-menu')

if (hamMenu && offScreenMenu) {
hamMenu.addEventListener('click', () => {
    hamMenu.classList.toggle('active')
    offScreenMenu.classList.toggle('active')
})
}
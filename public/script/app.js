const openDeleteModalBtn = document.querySelector('#open-delete-modal')
const deleteModalEl = document.querySelector('#delete-modal')
const cancelDeleteBtn = document.querySelector('#cancel-delete')

const toggleDeleteModal = (e) => {
    deleteModalEl.classList.toggle('show')

}

openDeleteModalBtn.addEventListener('click', toggleDeleteModal)
cancelDeleteBtn.addEventListener('click', toggleDeleteModal)
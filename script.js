const modal = {
  open(){
    // Abrir modal
    // Adicionar a class active ao modal
    const overlay = document.querySelector('.modal-overlay')
    overlay.classList.add('active')
  },
  close(){
    // Fechar Modal
    // Remove a class active do modal
    const overlay = document.querySelector('.modal-overlay')
    overlay.classList.remove('active')
  }
}
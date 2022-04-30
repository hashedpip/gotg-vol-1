const bootstrap = require('bootstrap')

function downloadBlob (blob, filename) {
  // Create an object URL for the blob object
  const url = URL.createObjectURL(blob)

  const receiptModal = new bootstrap.Modal(document.getElementById('receiptModal'))
  const closeModal_2 = document.getElementById('closeModal_2')

  closeModal_2.onclick = async () => {
    receiptModal.toggle()
  }

  const backup = document.createElement('button')
  backup.id = 'downloadReceipt'
  backup.classList.add('btn', 'btn-primary', 'download-link', 'btn-lg', 'btn-block', 'mb-3')
  backup.innerHTML = 'Download Receipt'
  backup.disabled = true
  // Create a new anchor element
  const a = document.createElement('a')

  // Set the href and download attributes for the anchor element
  // You can optionally set other attributes like `title`, etc
  // Especially, if the anchor element will be attached to the DOM
  // a.onclick = function() {console.log('Its Alive!');};
  a.id = 'downloadReceipt'
  a.classList.add('btn', 'btn-primary', 'download-link', 'btn-lg', 'btn-block', 'mb-3')
  a.innerHTML = 'Download Receipt'
  a.href = url
  a.download = filename || 'download'

  // Click handler that releases the object URL after the element has been clicked
  // This is required for one-off downloads of the blob content
  const clickHandler = function () {
    setTimeout(() => {
      // Release the object URL
      URL.revokeObjectURL(url)

      // Remove the event listener from the anchor element
      this.removeEventListener('click', clickHandler);

      // Remove the anchor element from the DOM
      (this.parentNode && this.parentNode.replaceChild(backup, this))
    }, 150)

    document.getElementById('sendToBlockchain').disabled = false
    receiptModal.toggle()
  }

  // Add the click event listener on the anchor element
  a.addEventListener('click', clickHandler, false)

  // Programmatically trigger a click on the anchor element
  // Useful if you want the download to happen automatically
  // Without attaching the anchor element to the DOM
  // a.click();

  // Return the anchor element
  // Useful if you want a reference to the element
  // in order to attach it to the DOM or use it in some other way
  return a
}

module.exports = { downloadBlob }

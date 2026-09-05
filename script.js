(function () {
  function getProduct(productId) {
    return (window.EVERYDAY_PRODUCTS || []).find(product => product.id === Number(productId));
  }

  function setModalText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  }

  window.openProductModal = function (productId) {
    const product = getProduct(productId);
    const modal = document.getElementById('product-modal');
    if (!product || !modal) return;

    const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    const image = document.getElementById('modal-main-img');
    image.src = product.image;
    image.alt = product.name;
    image.onerror = function () {
      this.src = `https://placehold.co/800x800/e2e8f0/64748b?text=${encodeURIComponent(product.name)}`;
    };

    setModalText('modal-title', product.name);
    setModalText('modal-price', `₹${product.price}`);
    setModalText('modal-mrp', `₹${product.originalPrice}`);
    setModalText('modal-discount', `${discount}% OFF`);
    setModalText('modal-description', product.description);

    const upiButton = document.getElementById('modal-upi-btn');
    const whatsappButton = document.getElementById('modal-whatsapp-btn');
    upiButton.onclick = function () {
      handleUpiClick(product.id);
    };
    whatsappButton.href = buildWhatsAppLink(product);

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.closeProductModal = function () {
    const modal = document.getElementById('product-modal');
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('product-modal');
    const closeButton = document.getElementById('product-modal-close');
    if (!modal) return;

    closeButton.addEventListener('click', window.closeProductModal);
    modal.addEventListener('click', function (event) {
      if (event.target === modal) window.closeProductModal();
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && modal.classList.contains('active')) {
        window.closeProductModal();
      }
    });
  });
})();

// ==========================================
// EFEITO DO HEADER NA ROLAGEM
// ==========================================
const mainHeader = document.getElementById('main-header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        mainHeader.classList.add('scrolled');
    } else {
        mainHeader.classList.remove('scrolled');
    }
});


// ==========================================
// ANIMAÇÕES DE SCROLL (SCROLL-REVEAL)
// ==========================================
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1
});

const elementsToAnimate = document.querySelectorAll('.fade-in');
elementsToAnimate.forEach(el => observer.observe(el));

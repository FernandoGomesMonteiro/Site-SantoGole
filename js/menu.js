// ==========================================
// MENU.JS — VERSÃO CORRIGIDA PARA MOBILE / iPHONE
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // EFEITO DO HEADER NA ROLAGEM
    // ==========================================
    const mainHeader = document.getElementById("main-header");

    if (mainHeader) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 50) {
                mainHeader.classList.add("scrolled");
            } else {
                mainHeader.classList.remove("scrolled");
            }
        });
    } else {
        console.warn("⚠️ main-header não encontrado no DOM.");
    }


    // ==========================================
    // ANIMAÇÕES DE SCROLL (SCROLL-REVEAL)
    // ==========================================
    const animatedElements = document.querySelectorAll(".fade-in");

    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver(
            (entries, obs) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        obs.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1 }
        );

        animatedElements.forEach((el) => observer.observe(el));
    } else {
        console.warn("⚠️ Nenhum .fade-in encontrado para animar.");
    }
});

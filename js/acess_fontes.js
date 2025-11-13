document.addEventListener("DOMContentLoaded", () => {
    const increaseBtn = document.getElementById("increase-text");
    const decreaseBtn = document.getElementById("decrease-text");

    if (!increaseBtn || !decreaseBtn) {
        console.warn("Accessibility buttons not found.");
        return;
    }

    // Pega o font-size base atual do :root (html) em px
    const root = document.documentElement;
    const computed = window.getComputedStyle(root).fontSize;
    const baseFontPx = parseFloat(localStorage.getItem("access_baseFontPx")) || parseFloat(computed) || 16;

    // Multiplier inicial salvo (1 = 100%)
    let multiplier = parseFloat(localStorage.getItem("access_textMultiplier")) || 1;

    // Limites
    const MIN_MULT = 0.7; // 70%
    const MAX_MULT = 1.6; // 160%
    const STEP = 0.1;     // +10% / -10%

    // Aplica o tamanho atual (em px) no :root
    function applyFontSize() {
        const newPx = Math.round(baseFontPx * multiplier * 10) / 10; // arredonda 1 casa decimal
        root.style.fontSize = `${newPx}px`;
        // salva estado
        localStorage.setItem("access_baseFontPx", baseFontPx);
        localStorage.setItem("access_textMultiplier", multiplier.toFixed(2));
    }

    // Inicializa
    applyFontSize();

    // Funções de incremento / decremento
    function increase() {
        multiplier = Math.min(MAX_MULT, Math.round((multiplier + STEP) * 100) / 100);
        applyFontSize();
    }

    function decrease() {
        multiplier = Math.max(MIN_MULT, Math.round((multiplier - STEP) * 100) / 100);
        applyFontSize();
    }

    increaseBtn.addEventListener("click", increase);
    decreaseBtn.addEventListener("click", decrease);

    // Acessibilidade de teclado: Enter e Space
    [increaseBtn, decreaseBtn].forEach(btn => {
        btn.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                btn.click();
            }
            // +/- keyboard shortcuts também
            if (e.key === "+" || e.key === "=") increase();
            if (e.key === "-") decrease();
        });
    });

    // Shortcuts globais: Ctrl + / Ctrl -
    window.addEventListener("keydown", (e) => {
        // evitar quando o usuário estiver digitando em inputs/textarea
        const tag = document.activeElement && document.activeElement.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || document.activeElement.isContentEditable) return;

        if ((e.ctrlKey || e.metaKey) && (e.key === "+" || e.key === "=")) {
            e.preventDefault();
            increase();
        }
        if ((e.ctrlKey || e.metaKey) && (e.key === "-")) {
            e.preventDefault();
            decrease();
        }
    });
});

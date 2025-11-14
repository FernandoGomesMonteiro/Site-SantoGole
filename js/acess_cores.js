// Acessibilidade - Sistema de Cores (Versão Final Testada)

(function () {
    'use strict';

    console.log('🎨 THEME MANAGER INICIADO - VERSÃO CORRIGIDA');

    const toggleButton = document.getElementById('toggle-theme');
    const htmlElement = document.documentElement;

    function getInitialTheme() {
        const savedTheme = localStorage.getItem('theme');
        console.log('💾 Tema salvo no localStorage:', savedTheme);

        if (savedTheme) return savedTheme;

        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            console.log('🖥️ Usando preferência do sistema: light');
            return 'light';
        }

        console.log('🌙 Usando tema padrão: dark');
        return 'dark';
    }

    function applyTheme(theme) {
        console.log('🔄 Aplicando tema:', theme);

        // Aplicar ao elemento html
        htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);

        updateButton(theme);
        debugCSSVariables();
    }

    function updateButton(theme) {
        if (!toggleButton) {
            console.error('❌ Botão toggle-theme não encontrado!');
            return;
        }

        const isLight = theme === 'light';
        toggleButton.setAttribute('aria-label',
            isLight ? 'Ativar modo escuro' : 'Ativar modo claro'
        );

        console.log('✅ Botão atualizado para tema:', theme);
    }

    function toggleTheme() {
        const currentTheme = htmlElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        console.log('🔄 Alternando tema:', currentTheme, '→', newTheme);
        applyTheme(newTheme);
    }

    function debugCSSVariables() {
        // Verificar se as variáveis CSS estão mudando
        const styles = getComputedStyle(document.documentElement);
        const darkColor = styles.getPropertyValue('--dark-color').trim();
        const textLight = styles.getPropertyValue('--text-light').trim();

        console.log('🎨 Variáveis CSS:');
        console.log('   --dark-color:', darkColor);
        console.log('   --text-light:', textLight);
        console.log('   data-theme no HTML:', htmlElement.getAttribute('data-theme'));
    }

    function init() {
        console.log('🚀 Inicializando theme manager...');
        const initialTheme = getInitialTheme();
        applyTheme(initialTheme);

        if (toggleButton) {
            toggleButton.addEventListener('click', toggleTheme);
            console.log('✅ Event listener adicionado ao botão');
        } else {
            console.error('❌ Botão toggle-theme não encontrado no DOM!');
        }


            }

    // Iniciar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
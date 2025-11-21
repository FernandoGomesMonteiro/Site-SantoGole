document.addEventListener('DOMContentLoaded', function () {
    // Elementos do DOM
    const drinksContainer = document.getElementById('drinks-container');
    const loadingSpinner = document.getElementById('loading-spinner');
    const totalResults = document.getElementById('total-results');
    const categoryFilter = document.getElementById('category-filter');
    const sortBy = document.getElementById('sort-by');
    const searchInput = document.getElementById('search-input');
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    const pageInfo = document.getElementById('page-info');
    const sophisticatedText = document.querySelector('.sophisticated-text');

    // Variáveis de estado
    let allDrinks = [];
    let filteredDrinks = [];
    let currentPage = 1;
    const drinksPerPage = 12;

    // Inicializar a aplicação
    init();

    function init() {
        fetchDrinks();
        setupEventListeners();
        createModal(); // Criar o modal dinamicamente
    }

    function setupEventListeners() {
        categoryFilter.addEventListener('change', filterDrinks);
        sortBy.addEventListener('change', filterDrinks);
        searchInput.addEventListener('input', debounce(filterDrinks, 300));
        prevPageBtn.addEventListener('click', goToPrevPage);
        nextPageBtn.addEventListener('click', goToNextPage);
    }

    // Função para criar o modal
    function createModal() {
        const modalHTML = `
            <div id="drink-modal" class="modal" style="display: none;">
                <div class="modal-overlay" id="modal-overlay"></div>
                <div class="modal-content">
                    <button class="modal-close" id="modal-close">
                        <i class="fas fa-times"></i>
                    </button>
                    <div class="modal-body" id="modal-body">
                        <!-- Conteúdo do modal será inserido aqui -->
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Event listeners para fechar o modal
        document.getElementById('modal-overlay').addEventListener('click', closeModal);
        document.getElementById('modal-close').addEventListener('click', closeModal);

        // Fechar modal com ESC
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeModal();
        });
    }

    // Função para abrir o modal
    function openModal(drinkId) {
        showLoadingModal(true);
        fetchDrinkDetails(drinkId);
        document.getElementById('drink-modal').style.display = 'block';
        document.body.style.overflow = 'hidden'; // Previne scroll do body
    }

    // Função para fechar o modal
    function closeModal() {
        document.getElementById('drink-modal').style.display = 'none';
        document.body.style.overflow = 'auto'; // Restaura scroll do body
    }

    // Função para buscar detalhes do drink
    async function fetchDrinkDetails(drinkId) {
        try {
            const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drinkId}`);
            const data = await response.json();

            if (data.drinks && data.drinks.length > 0) {
                renderDrinkDetail(data.drinks[0]);
            } else {
                showErrorModal('Drink não encontrado.');
            }
        } catch (error) {
            console.error('Erro ao buscar detalhes do drink:', error);
            showErrorModal('Não foi possível carregar os detalhes do drink.');
        }
    }

    // Função para renderizar os detalhes no modal
    // Função para renderizar os detalhes no modal (ATUALIZADA COM TRADUÇÃO AUTOMÁTICA)
    async function renderDrinkDetail(drink) {
        // Coletar ingredientes
        const ingredients = [];
        for (let i = 1; i <= 15; i++) {
            const ingredient = drink[`strIngredient${i}`];
            const measure = drink[`strMeasure${i}`];
            if (ingredient && ingredient.trim() !== '') {
                ingredients.push({
                    ingredient: ingredient,
                    measure: measure || ''
                });
            }
        }

        // Mostrar loading enquanto traduz
        const modalBody = document.getElementById('modal-body');
        ;

        try {
            // Traduzir ingredientes
            const translatedIngredients = await translateIngredients(ingredients);

            // Traduzir instruções também
            const translatedInstructions = drink.strInstructions ?
                await translateText(drink.strInstructions, 'pt') :
                'Instruções não disponíveis.';

            // Renderizar o modal com conteúdo traduzido
            modalBody.innerHTML = `
                <div class="drink-detail-modal">
                    <div class="drink-header">
                        <div class="drink-image-container">
                            <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}" class="drink-image-large">
                        </div>
                        <div class="drink-basic-info">
                            <h1 class="drink-name-large">${drink.strDrink}</h1>
                            <p class="drink-category-large">${drink.strCategory || 'Categoria não disponível'}</p>
                            <div class="meta-info">
                                <span class="meta-tag">${drink.strAlcoholic || 'Unknown'}</span>
                                <span class="meta-tag">${drink.strGlass || 'Unknown'}</span>
                            </div>
                        </div>
                    </div>

                    <div class="drink-content">
                        <div class="ingredients-section">
                            <h2>Ingredientes</h2>
                            <ul class="ingredients-list">
                                ${translatedIngredients.map(item => `
                                    <li>
                                        <span class="ingredient-name">${item.ingredient}</span>
                                        <span class="ingredient-measure">${item.measure}</span>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>

                        <div class="instructions-section">
                            <h2>Instruções</h2>
                            <div class="instructions">${translatedInstructions}</div>
                        </div>

                        ${drink.strVideo ? `
                            <div class="video-section">
                                <h2>Vídeo</h2>
                                <div class="video-container">
                                    <a href="${drink.strVideo}" target="_blank" class="video-link">
                                        <i class="fab fa-youtube"></i>
                                        Ver tutorial no YouTube
                                    </a>
                                </div>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;

        } catch (error) {
            console.error('Erro ao processar tradução:', error);
            // Fallback: mostrar sem tradução em caso de erro
            modalBody.innerHTML = `
                <div class="drink-detail-modal">
                    <div class="drink-header">
                        <div class="drink-image-container">
                            <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}" class="drink-image-large">
                        </div>
                        <div class="drink-basic-info">
                            <h1 class="drink-name-large">${drink.strDrink}</h1>
                            <p class="drink-category-large">${drink.strCategory || 'Categoria não disponível'}</p>
                            <div class="meta-info">
                                <span class="meta-tag">${drink.strAlcoholic || 'Unknown'}</span>
                                <span class="meta-tag">${drink.strGlass || 'Unknown'}</span>
                            </div>
                        </div>
                    </div>

                    <div class="drink-content">
                        <div class="ingredients-section">
                            <h2>Ingredientes <small class="error-text">(Tradução indisponível)</small></h2>
                            <ul class="ingredients-list">
                                ${ingredients.map(item => `
                                    <li>
                                        <span class="ingredient-name">${item.ingredient}</span>
                                        <span class="ingredient-measure">${item.measure}</span>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>

                        <div class="instructions-section">
                            <h2>Instruções</h2>
                            <div class="instructions">${drink.strInstructions || 'Instruções não disponíveis.'}</div>
                        </div>

                        ${drink.strVideo ? `
                            <div class="video-section">
                                <h2>Vídeo</h2>
                                <div class="video-container">
                                    <a href="${drink.strVideo}" target="_blank" class="video-link">
                                        <i class="fab fa-youtube"></i>
                                        Ver tutorial no YouTube
                                    </a>
                                </div>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }
    }

    // Função para mostrar erro no modal
    function showErrorModal(message) {
        const modalBody = document.getElementById('modal-body');
        modalBody.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <h2>Ocorreu um erro</h2>
                <p>${message}</p>
                <button class="retry-btn" onclick="closeModal()">Fechar</button>
            </div>
        `;
        showLoadingModal(false);
    }

    // Função para mostrar/ocultar loading no modal
    function showLoadingModal(show) {
        if (show) {
            document.getElementById('modal-body').innerHTML = `
                <div class="loading">
                    <div class="spinner"></div>
                    <p>Carregando detalhes do drink...</p>
                </div>
            `;
        }
    }

    // Função para traduzir texto usando Google Translate API gratuita
    async function translateText(text, targetLang = 'pt') {
        if (!text || text.trim() === '') return text;

        try {
            // API gratuita do Google Translate
            const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`);
            const data = await response.json();

            // A resposta vem em um formato específico, extraímos a tradução
            if (data && data[0] && data[0][0] && data[0][0][0]) {
                return data[0][0][0];
            }
            return text; // Retorna original se falhar
        } catch (error) {
            console.error('Erro na tradução:', error);
            return text; // Retorna original em caso de erro
        }
    }

    // Função para traduzir lista de ingredientes
    async function translateIngredients(ingredientsList) {
        const translatedIngredients = [];

        for (const item of ingredientsList) {
            if (item.ingredient && item.ingredient.trim() !== '') {
                try {
                    const translatedIngredient = await translateText(item.ingredient, 'pt');
                    translatedIngredients.push({
                        ingredient: translatedIngredient,
                        originalIngredient: item.ingredient,
                        measure: item.measure || ''
                    });
                } catch (error) {
                    console.error('Erro ao traduzir ingrediente:', error);
                    translatedIngredients.push({
                        ingredient: item.ingredient, // Mantém original se falhar
                        originalIngredient: item.ingredient,
                        measure: item.measure || ''
                    });
                }
            }
        }

        return translatedIngredients;
    }

    // Função para buscar drinks da API
    async function fetchDrinks() {
        showLoading(true);

        try {
            // Buscar drinks por primeira letra (A-Z)
            const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
            const promises = letters.map(letter =>
                fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?f=${letter}`)
                    .then(response => response.json())
            );

            const results = await Promise.all(promises);

            // Combinar todos os resultados
            allDrinks = results
                .filter(result => result.drinks)
                .flatMap(result => result.drinks)
                .filter((drink, index, self) =>
                    index === self.findIndex(d => d.idDrink === drink.idDrink)
                );

            showLoading(false);
            filterDrinks();
        } catch (error) {
            console.error('Erro ao buscar drinks:', error);
            showLoading(false);
            drinksContainer.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-exclamation-circle"></i>
                    <h3>Ocorreu um erro</h3>
                    <p>Não foi possível carregar os drinks. Por favor, tente novamente.</p>
                </div>
            `;
        }
    }

    // Função para filtrar e ordenar drinks
    async function filterDrinks() {
        const categoryValue = categoryFilter.value;
        const sortValue = sortBy.value;
        const searchValue = searchInput.value.toLowerCase();

        filteredDrinks = allDrinks.filter(drink => {
            const matchesCategory = categoryValue === 'all' || drink.strCategory === categoryValue;
            const matchesSearch = drink.strDrink.toLowerCase().includes(searchValue);
            return matchesCategory && matchesSearch;
        });

        switch (sortValue) {
            case 'name-asc':
                filteredDrinks.sort((a, b) => a.strDrink.localeCompare(b.strDrink));
                break;
            case 'name-desc':
                filteredDrinks.sort((a, b) => b.strDrink.localeCompare(a.strDrink));
                break;
            case 'category':
                filteredDrinks.sort((a, b) => a.strCategory.localeCompare(b.strCategory));
                break;
        }

        totalResults.textContent = filteredDrinks.length;
        currentPage = 1;
        await renderDrinks(); // Agora é async
        updatePagination();
    }

    // Função para traduzir os dados dos drinks para os cards
    async function translateDrinksForCards(drinks) {
        // Coletar todos os textos que precisam ser traduzidos
        const textsToTranslate = [];
        const drinkTextMap = [];

        drinks.forEach(drink => {
            // Nome do drink
            if (drink.strDrink) {
                textsToTranslate.push(drink.strDrink);
                drinkTextMap.push({ type: 'name', drinkId: drink.idDrink });
            }

            // Categoria
            if (drink.strCategory) {
                textsToTranslate.push(drink.strCategory);
                drinkTextMap.push({ type: 'category', drinkId: drink.idDrink });
            }

            // Tipo alcoólico
            if (drink.strAlcoholic) {
                textsToTranslate.push(drink.strAlcoholic);
                drinkTextMap.push({ type: 'alcoholic', drinkId: drink.idDrink });
            }

            // Copo
            if (drink.strGlass) {
                textsToTranslate.push(drink.strGlass);
                drinkTextMap.push({ type: 'glass', drinkId: drink.idDrink });
            }
        });

        // Traduzir todos os textos
        const translatedTexts = await translateMultipleTexts(textsToTranslate, 'pt');

        // Criar um mapa com as traduções
        const translationMap = {};
        drinkTextMap.forEach((item, index) => {
            if (!translationMap[item.drinkId]) {
                translationMap[item.drinkId] = {};
            }
            translationMap[item.drinkId][item.type] = translatedTexts[index];
        });

        // Aplicar as traduções aos drinks
        return drinks.map(drink => {
            const translations = translationMap[drink.idDrink] || {};
            return {
                ...drink,
                translatedName: translations.name || drink.strDrink,
                translatedCategory: translations.category || drink.strCategory,
                translatedAlcoholic: translations.alcoholic || drink.strAlcoholic,
                translatedGlass: translations.glass || drink.strGlass
            };
        });
    }

    // Função para traduzir múltiplos textos em lote com cache
    async function translateMultipleTexts(texts, targetLang = 'pt') {
        if (!texts || texts.length === 0) return texts;

        const translatedTexts = [];
        const translationCache = JSON.parse(localStorage.getItem('translationCache') || '{}');

        for (const text of texts) {
            if (!text || text.trim() === '') {
                translatedTexts.push(text);
                continue;
            }

            // Verificar se já temos no cache
            const cacheKey = `${text}_${targetLang}`;
            if (translationCache[cacheKey]) {
                translatedTexts.push(translationCache[cacheKey]);
                continue;
            }

            try {
                const translated = await translateText(text, targetLang);
                translatedTexts.push(translated);

                // Salvar no cache
                translationCache[cacheKey] = translated;
                localStorage.setItem('translationCache', JSON.stringify(translationCache));

                // Pequeno delay para não sobrecarregar a API
                await new Promise(resolve => setTimeout(resolve, 50));
            } catch (error) {
                console.error('Erro ao traduzir:', text, error);
                translatedTexts.push(text);
            }
        }

        return translatedTexts;
    }

    // Função para renderizar os drinks (MODIFICADA)
    async function renderDrinks() {
        const startIndex = (currentPage - 1) * drinksPerPage;
        const endIndex = startIndex + drinksPerPage;
        const currentDrinks = filteredDrinks.slice(startIndex, endIndex);

        if (currentDrinks.length === 0) {
            drinksContainer.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>Nenhum drink encontrado</h3>
                    <p>Tente ajustar os filtros ou a busca</p>
                </div>
            `;
            return;
        }

        // Mostrar loading enquanto traduz
        drinksContainer.innerHTML = `
            <div class="loading-cards">
                <div class="spinner"></div>
                <p>Traduzindo drinks...</p>
            </div>
        `;

        try {
            // Traduzir os drinks para a página atual
            const translatedDrinks = await translateDrinksForCards(currentDrinks);

            // Renderizar os cards com as traduções
            drinksContainer.innerHTML = translatedDrinks.map(drink => `
                <div class="drink-card" data-drink-id="${drink.idDrink}">
                    <img src="${drink.strDrinkThumb}/preview" alt="${drink.translatedName}" class="drink-image">
                    <div class="drink-info">
                        <h1 class="drink-name">${drink.translatedName}</h1>
                        <p class="drink-category">${drink.translatedCategory}</p>
                        <div class="drink-tags">
                            <span class="drink-tag">${drink.translatedAlcoholic || 'Desconhecido'}</span>
                            <span class="drink-tag">${drink.translatedGlass || 'Desconhecido'}</span>
                        </div>
                    </div>
                </div>
            `).join('');

            // Adiciona event listeners para os cards
            document.querySelectorAll('.drink-card').forEach(card => {
                card.addEventListener('click', function () {
                    const drinkId = this.getAttribute('data-drink-id');
                    openModal(drinkId);
                });
            });

        } catch (error) {
            console.error('Erro ao traduzir cards:', error);
            // Fallback: mostrar sem tradução
            drinksContainer.innerHTML = currentDrinks.map(drink => `
                <div class="drink-card" data-drink-id="${drink.idDrink}">
                    <img src="${drink.strDrinkThumb}/preview" alt="${drink.strDrink}" class="drink-image">
                    <div class="drink-info">
                        <h1 class="drink-name">${drink.strDrink}</h1>
                        <p class="drink-category">${drink.strCategory}</p>
                        <div class="drink-tags">
                            <span class="drink-tag">${drink.strAlcoholic || 'Unknown'}</span>
                            <span class="drink-tag">${drink.strGlass || 'Unknown'}</span>
                        </div>
                    </div>
                </div>
            `).join('');

            // Adiciona event listeners para os cards (fallback)
            document.querySelectorAll('.drink-card').forEach(card => {
                card.addEventListener('click', function () {
                    const drinkId = this.getAttribute('data-drink-id');
                    openModal(drinkId);
                });
            });
        }
    }

    // Função para atualizar a paginação
    function updatePagination() {
        const totalPages = Math.ceil(filteredDrinks.length / drinksPerPage);

        pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
    }

    // Função para ir para a página anterior
    async function goToPrevPage() {
        if (currentPage > 1) {
            currentPage--;
            await renderDrinks(); // Agora é async
            updatePagination();
            const y = sophisticatedText.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    }

    // Função para ir para a próxima página
    async function goToNextPage() {
        const totalPages = Math.ceil(filteredDrinks.length / drinksPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            await renderDrinks(); // Agora é async
            updatePagination();
            const y = sophisticatedText.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    }

    // Função para mostrar/ocultar o loading
    function showLoading(show) {
        loadingSpinner.style.display = show ? 'block' : 'none';
    }

    // Função debounce para melhorar performance na busca
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
});
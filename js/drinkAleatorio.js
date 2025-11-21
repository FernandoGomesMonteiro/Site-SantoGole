// floating-random.js
document.addEventListener('DOMContentLoaded', function () {
    // Elementos do DOM
    const floatingBtn = document.getElementById('floating-random-btn');
    const randomModal = document.getElementById('random-drink-modal');
    const modalOverlay = document.getElementById('random-modal-overlay');
    const modalClose = document.getElementById('random-modal-close');
    const modalRandomBtn = document.getElementById('modal-random-btn');
    const resultsGrid = document.getElementById('results-grid');
    const loadingMessage = document.getElementById('loading-message');
    const errorMessage = document.getElementById('error-message');

    // Event Listeners
    floatingBtn.addEventListener('click', openRandomModal);
    modalOverlay.addEventListener('click', closeRandomModal);
    modalClose.addEventListener('click', closeRandomModal);
    modalRandomBtn.addEventListener('click', getRandomDrink);

    // Fechar modal com ESC
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && randomModal.style.display === 'block') {
            closeRandomModal();
        }
    });

    // Função para abrir o modal
    function openRandomModal() {
        randomModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        // Limpar resultados anteriores
        resultsGrid.innerHTML = '';
        hideMessages();
    }

    // Função para fechar o modal
    function closeRandomModal() {
        randomModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Função para buscar um drink aleatório
    async function getRandomDrink() {
        showLoading();
        hideError();
        resultsGrid.innerHTML = '';

        try {
            const response = await fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php');
            const data = await response.json();

            hideLoading();

            if (data.drinks && data.drinks.length > 0) {
                displayRandomDrink(data.drinks[0]);
            } else {
                showError();
            }
        } catch (error) {
            console.error('Erro ao buscar drink aleatório:', error);
            hideLoading();
            showError();
        }
    }

    // Função para exibir o drink aleatório (MODIFICADA)
    function displayRandomDrink(drink) {
        resultsGrid.innerHTML = `
                <div class="result-card" data-drink-id="${drink.idDrink}">
                    <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}" class="result-image">
                    <div class="result-content">
                        <h3>${drink.strDrink}</h3>
                        <p>${drink.strCategory} • ${drink.strAlcoholic}</p>
                        <button class="view-recipe" onclick="showRecipe('${drink.idDrink}')">
                            Ver Receita Completa
                        </button>
                    </div>
                </div>
            `;
    }

    // Função para mostrar a receita completa (agora global)
    window.showRecipe = async function (drinkId) {
        // Mostrar loading na área de resultados
        resultsGrid.innerHTML = `
                <div class="recipe-loading">
                    <div class="spinner"></div>
                    <p>Carregando receita completa...</p>
                </div>
            `;

        try {
            const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drinkId}`);
            const data = await response.json();

            if (data.drinks && data.drinks.length > 0) {
                const drink = data.drinks[0];
                displayRecipe(drink);
            } else {
                showError();
            }
        } catch (error) {
            console.error('Erro ao buscar receita:', error);
            showError();
        }
    };

    // Função para exibir a receita completa
    function displayRecipe(drink) {
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

        // Exibir a receita completa
        resultsGrid.innerHTML = `
                <div class="recipe-modal-content">
                    <div class="recipe-header">
                        <h2>${drink.strDrink}</h2>
                        <p>${drink.strCategory} • ${drink.strAlcoholic}</p>
                    </div>
                    
                    <div class="recipe-body">
                        <div>
                            <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}" class="recipe-image">
                            <div class="recipe-meta" style="margin-top: 1rem;">
                                <span class="recipe-tag">${drink.strGlass || 'Copo não especificado'}</span>
                                <span class="recipe-tag">${drink.strAlcoholic || 'Tipo não especificado'}</span>
                            </div>
                        </div>
                        
                        <div class="recipe-details">
                            <div class="ingredients-section">
                                <h3>Ingredientes</h3>
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
                                <h3>Instruções</h3>
                                <div class="instructions">${drink.strInstructions || 'Instruções não disponíveis.'}</div>
                            </div>
                        </div>
                    </div>
                    

                </div>
            `;
    }

    // Função para fechar a receita e voltar ao estado inicial
    window.closeRecipe = function () {
        resultsGrid.innerHTML = '';
        hideMessages();
    };

    // Funções auxiliares para mensagens
    function showLoading() {
        loadingMessage.style.display = 'block';
    }

    function hideLoading() {
        loadingMessage.style.display = 'none';
    }

    function showError() {
        errorMessage.style.display = 'block';
        resultsGrid.innerHTML = '';
    }

    function hideError() {
        errorMessage.style.display = 'none';
    }

    function hideMessages() {
        hideLoading();
        hideError();
    }
});
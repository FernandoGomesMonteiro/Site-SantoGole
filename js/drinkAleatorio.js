// js/drinks-aleatorios.js - VERSÃO OTIMIZADA
class RandomDrinkModal {
    constructor() {
        this.modal = document.getElementById('random-drink-modal');
        this.resultsGrid = document.getElementById('results-grid');
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // Event delegation para melhor performance
        document.addEventListener('click', (e) => {
            if (e.target.closest('#floating-random-btn')) this.open();
            if (e.target.closest('#random-modal-close, #random-modal-overlay')) this.close();
            if (e.target.closest('#modal-random-btn')) this.getRandomDrink();
            if (e.target.closest('.view-recipe')) {
                const drinkId = e.target.closest('.view-recipe').dataset.drinkId;
                this.showRecipe(drinkId);
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.style.display === 'block') {
                this.close();
            }
        });
    }

    open() {
        this.modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        this.clearResults();
    }

    close() {
        this.modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    async getRandomDrink() {
        this.showLoading();

        try {
            // Cache simples
            const cacheKey = 'randomDrink';
            const cached = sessionStorage.getItem(cacheKey);

            if (cached) {
                const drink = JSON.parse(cached);
                this.displayRandomDrink(drink);
                return;
            }

            const response = await fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php');
            const data = await response.json();

            if (data.drinks?.[0]) {
                const drink = data.drinks[0];
                // Cache por 5 minutos
                sessionStorage.setItem(cacheKey, JSON.stringify(drink));
                this.displayRandomDrink(drink);
            } else {
                this.showError();
            }
        } catch (error) {
            console.error('Erro ao buscar drink:', error);
            this.showError();
        }
    }

    displayRandomDrink(drink) {
        this.resultsGrid.innerHTML = this.createDrinkCard(drink);
    }

    createDrinkCard(drink) {
        return `
            <div class="result-card">
                <img 
                    src="${drink.strDrinkThumb}" 
                    alt="${drink.strDrink}" 
                    class="result-image"
                    loading="lazy"
                >
                <div class="result-content">
                    <h3>${drink.strDrink}</h3>
                    <p>${drink.strCategory} • ${drink.strAlcoholic}</p>
                    <button class="view-recipe" data-drink-id="${drink.idDrink}">
                        Ver Receita Completa
                    </button>
                </div>
            </div>
        `;
    }

    async showRecipe(drinkId) {
        this.resultsGrid.innerHTML = `
            <div class="recipe-loading">
                <div class="spinner"></div>
                <p>Carregando receita...</p>
            </div>
        `;

        try {
            const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drinkId}`);
            const data = await response.json();

            if (data.drinks?.[0]) {
                this.displayRecipe(data.drinks[0]);
            } else {
                this.showError();
            }
        } catch (error) {
            console.error('Erro ao buscar receita:', error);
            this.showError();
        }
    }

    displayRecipe(drink) {
        const ingredients = this.extractIngredients(drink);
        this.resultsGrid.innerHTML = this.createRecipeHTML(drink, ingredients);
    }

    extractIngredients(drink) {
        const ingredients = [];
        for (let i = 1; i <= 15; i++) {
            const ingredient = drink[`strIngredient${i}`];
            const measure = drink[`strMeasure${i}`];
            if (ingredient?.trim()) {
                ingredients.push({ ingredient, measure: measure || '' });
            }
        }
        return ingredients;
    }

    createRecipeHTML(drink, ingredients) {
        return `
            <div class="recipe-modal-content">
                <div class="recipe-header">
                    <h2>${drink.strDrink}</h2>
                    <p>${drink.strCategory} • ${drink.strAlcoholic}</p>
                </div>
                <div class="recipe-body">
                    <div>
                        <img 
                            src="${drink.strDrinkThumb}" 
                            alt="${drink.strDrink}" 
                            class="recipe-image"
                            loading="lazy"
                        >
                        <div class="recipe-meta">
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

    showLoading() {
        // Implementar se necessário
    }

    showError() {
        this.resultsGrid.innerHTML = `
            <div class="message" id="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>Não foi possível carregar o drink. Tente novamente.</p>
            </div>
        `;
    }

    clearResults() {
        this.resultsGrid.innerHTML = '';
    }
}

// Inicialização otimizada
document.addEventListener('DOMContentLoaded', () => {
    new RandomDrinkModal();
});
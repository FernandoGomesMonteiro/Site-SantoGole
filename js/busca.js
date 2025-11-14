document.addEventListener('DOMContentLoaded', () => {
    // Elementos do DOM
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const randomBtn = document.getElementById('random-btn');
    const resultsGrid = document.getElementById('results-grid');
    const loadingMessage = document.getElementById('loading-message');
    const errorMessage = document.getElementById('error-message');
    const drinkModal = document.getElementById('drink-modal');
    const closeModal = document.getElementById('close-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalImage = document.getElementById('modal-image');
    const modalCategory = document.getElementById('modal-category');
    const modalGlass = document.getElementById('modal-glass');
    const modalAlcoholic = document.getElementById('modal-alcoholic');
    const modalIngredients = document.getElementById('modal-ingredients');
    const modalInstructions = document.getElementById('modal-instructions');

    // Event Listeners
    searchBtn.addEventListener('click', searchDrinks);
    randomBtn.addEventListener('click', getRandomDrink);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchDrinks();
        }
    });
    closeModal.addEventListener('click', () => {
        drinkModal.style.display = 'none';
    });

    // Fechar modal ao clicar fora dele
    window.addEventListener('click', (e) => {
        if (e.target === drinkModal) {
            drinkModal.style.display = 'none';
        }
    });

    // Função para buscar drinks
    async function searchDrinks() {
        const searchTerm = searchInput.value.trim();

        if (searchTerm === '') {
            alert('Por favor, digite o nome de um drink');
            return;
        }

        showLoading();
        hideError();

        try {
            const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchTerm}`);
            const data = await response.json();

            hideLoading();

            if (data.drinks) {
                displayDrinks(data.drinks);
            } else {
                showError();
            }
        } catch (error) {
            console.error('Erro ao buscar drinks:', error);
            hideLoading();
            showError();
        }
    }

    // Função para buscar um drink aleatório
    async function getRandomDrink() {
        showLoading();
        hideError();

        try {
            const response = await fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php');
            const data = await response.json();

            hideLoading();

            if (data.drinks) {
                displayDrinks(data.drinks);
            } else {
                showError();
            }
        } catch (error) {
            console.error('Erro ao buscar drink aleatório:', error);
            hideLoading();
            showError();
        }
    }

    // Função para exibir drinks na grade
    function displayDrinks(drinks) {
        resultsGrid.innerHTML = '';

        drinks.forEach(drink => {
            const drinkCard = document.createElement('div');
            drinkCard.className = 'result-card';

            drinkCard.innerHTML = `
            <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}" class="result-image">
            <div class="result-content">
                <h3>${drink.strDrink}</h3>
                <p>${drink.strCategory}</p>
                <!-- ALTERAÇÃO AQUI: Link para detalhes.html em vez de modal -->
                <a href="detalhes.html?id=${drink.idDrink}" class="view-recipe">
                    Ver Receita
                </a>
            </div>
        `;

            resultsGrid.appendChild(drinkCard);
        });

        // Adicionar event listeners aos botões
        document.querySelectorAll('.view-recipe').forEach(button => {
            button.addEventListener('click', (e) => {
                const drinkId = e.target.getAttribute('data-id');
                getDrinkDetails(drinkId);
            });
        });
    }

    // Função para obter detalhes de um drink específico
    async function getDrinkDetails(drinkId) {
        showLoading();

        try {
            const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drinkId}`);
            const data = await response.json();

            hideLoading();

            if (data.drinks) {
                showDrinkDetails(data.drinks[0]);
            }
        } catch (error) {
            console.error('Erro ao buscar detalhes do drink:', error);
            hideLoading();
        }
    }

    // Função para exibir detalhes do drink no modal
    function showDrinkDetails(drink) {
        modalTitle.textContent = drink.strDrink;
        modalImage.src = drink.strDrinkThumb;
        modalCategory.textContent = `Categoria: ${drink.strCategory}`;
        modalGlass.textContent = `Copo: ${drink.strGlass}`;
        modalAlcoholic.textContent = `Tipo: ${drink.strAlcoholic}`;

        // Ingredientes e medidas
        modalIngredients.innerHTML = '';
        for (let i = 1; i <= 15; i++) {
            const ingredient = drink[`strIngredient${i}`];
            const measure = drink[`strMeasure${i}`];

            if (ingredient && ingredient.trim() !== '') {
                const li = document.createElement('li');
                li.textContent = `${measure ? measure : ''} ${ingredient}`;
                modalIngredients.appendChild(li);
            }
        }

        // Instruções
        modalInstructions.textContent = drink.strInstructions;

        // Exibir modal
        drinkModal.style.display = 'block';
    }

    // Funções auxiliares para exibir/ocultar mensagens
    function showLoading() {
        loadingMessage.style.display = 'block';
        resultsGrid.innerHTML = '';
        hideError();
    }

    function hideLoading() {
        loadingMessage.style.display = 'none';
    }

    function showError() {
        errorMessage.style.display = 'block';
    }

    function hideError() {
        errorMessage.style.display = 'none';
    }

    // Função utilitária para buscar drinks pela API e retornar o array de objetos
    async function fetchDrinks(term) {
        if (!term || term.trim() === '') return [];
        try {
            const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${encodeURIComponent(term)}`);
            const data = await response.json();
            return data.drinks || [];
        } catch (error) {
            console.error('Erro na fetchDrinks:', error);
            throw error;
        }
    }

    // Expor a função globalmente para outras páginas/scripts (por exemplo, roleta.html)
    window.fetchDrinks = fetchDrinks;
});
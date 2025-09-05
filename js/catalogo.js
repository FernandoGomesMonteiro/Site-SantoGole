document.addEventListener('DOMContentLoaded', function() {
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
    }
    
    function setupEventListeners() {
        categoryFilter.addEventListener('change', filterDrinks);
        sortBy.addEventListener('change', filterDrinks);
        searchInput.addEventListener('input', debounce(filterDrinks, 300));
        prevPageBtn.addEventListener('click', goToPrevPage);
        nextPageBtn.addEventListener('click', goToNextPage);
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
    function filterDrinks() {
        const categoryValue = categoryFilter.value;
        const sortValue = sortBy.value;
        const searchValue = searchInput.value.toLowerCase();
        
        // Aplicar filtros
        filteredDrinks = allDrinks.filter(drink => {
            const matchesCategory = categoryValue === 'all' || drink.strCategory === categoryValue;
            const matchesSearch = drink.strDrink.toLowerCase().includes(searchValue);
            return matchesCategory && matchesSearch;
        });
        
        // Aplicar ordenação
        switch(sortValue) {
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
        
        // Atualizar contador de resultados
        totalResults.textContent = filteredDrinks.length;
        
        // Resetar para a primeira página
        currentPage = 1;
        renderDrinks();
        updatePagination();
    }
    
    // Função para renderizar os drinks na página atual
    function renderDrinks() {
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
        
        // ***** ALTERAÇÃO APLICADA AQUI *****
        // Agora a tag <a> envolve todo o card do drink.
        drinksContainer.innerHTML = currentDrinks.map(drink => `
            <a href="detalhes.html?id=${drink.idDrink}" class="drink-card-link">
                <div class="drink-card">
                    <img src="${drink.strDrinkThumb}/preview" alt="${drink.strDrink}" class="drink-image">
                    <div class="drink-info">
                        <h3 class="drink-name">${drink.strDrink}</h3>
                        <p class="drink-category">${drink.strCategory}</p>
                        <div class="drink-tags">
                            <span class="drink-tag">${drink.strAlcoholic || 'Unknown'}</span>
                            <span class="drink-tag">${drink.strGlass || 'Unknown'}</span>
                        </div>
                    </div>
                </div>
            </a>
        `).join('');
    }
    
    // Função para atualizar a paginação
    function updatePagination() {
        const totalPages = Math.ceil(filteredDrinks.length / drinksPerPage);
        
        pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
    }
    
    // Função para ir para a página anterior
    function goToPrevPage() {
        if (currentPage > 1) {
            currentPage--;
            renderDrinks();
            updatePagination();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
    
    // Função para ir para a próxima página
    function goToNextPage() {
        const totalPages = Math.ceil(filteredDrinks.length / drinksPerPage);
        
        if (currentPage < totalPages) {
            currentPage++;
            renderDrinks();
            updatePagination();
            window.scrollTo({ top: 0, behavior: 'smooth' });
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
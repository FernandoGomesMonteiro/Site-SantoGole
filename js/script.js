// ==========================================
// LÓGICA PARA ALTERNAR O TEMA (DARK MODE)
// ==========================================
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const moonIcon = '<i class="fas fa-moon"></i>';
const sunIcon = '<i class="fas fa-sun"></i>';

const applyTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
        themeToggle.innerHTML = sunIcon;
        themeToggle.setAttribute('aria-label', 'Ativar modo claro');
    } else {
        body.classList.remove('dark-theme');
        themeToggle.innerHTML = moonIcon;
        themeToggle.setAttribute('aria-label', 'Ativar modo escuro');
    }
};

const toggleTheme = () => {
    body.classList.toggle('dark-theme');
    if (body.classList.contains('dark-theme')) {
        localStorage.setItem('theme', 'dark');
        themeToggle.innerHTML = sunIcon;
        themeToggle.setAttribute('aria-label', 'Ativar modo claro');
    } else {
        localStorage.setItem('theme', 'light');
        themeToggle.innerHTML = moonIcon;
        themeToggle.setAttribute('aria-label', 'Ativar modo escuro');
    }
};

themeToggle.addEventListener('click', toggleTheme);
applyTheme();


// ==========================================
// LÓGICA DA BUSCA NO HEADER
// ==========================================
const searchToggle = document.getElementById('search-toggle');
const searchContainer = document.getElementById('search-container');

searchToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    searchContainer.classList.toggle('active');
    if (searchContainer.classList.contains('active')) {
        document.getElementById('search-input').focus();
    }
});

document.addEventListener('click', (e) => {
    if (!searchContainer.contains(e.target) && !searchToggle.contains(e.target)) {
        searchContainer.classList.remove('active');
    }
});


// ==========================================
// LÓGICA DO MENU MOBILE
// ==========================================
const hamburgerBtn = document.getElementById('hamburger-btn');
const mobileNav = document.getElementById('mobile-nav');
const closeBtn = document.getElementById('close-btn');
const mobileNavLinks = mobileNav.querySelectorAll('a');

const openNav = () => {
    mobileNav.classList.add('open');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
};
const closeNav = () => {
    mobileNav.classList.remove('open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
};

hamburgerBtn.addEventListener('click', openNav);
closeBtn.addEventListener('click', closeNav);
mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeNav);
});


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


// ==========================================
// LÓGICA PRINCIPAL DA PÁGINA (CARROSSEL, FILTROS, MODAL)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const drinks = [
        { id: 1, name: "Negroni Clássico", description: "Um cocktail italiano atemporal com gin, vermute tinto e Campari.", image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", category: "classicos", ingredients: [ "30ml de Gin", "30ml de Vermute Rosso", "30ml de Campari", "Gelo", "Lasca de laranja para decorar" ], instructions: [ "Encha um copo baixo com gelo", "Adicione quantidades iguais de Gin, Vermute e Campari", "Mexa suavemente por 30 segundos", "Decore com uma lasca de laranja" ] },
        { id: 2, name: "Mojito Tropical", description: "Um refrescante drink cubano com rum, hortelã, limão e água com gás.", image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", category: "tropicais", ingredients: [ "50ml de rum branco", "6 folhas de hortelã", "30ml de suco de limão", "2 colheres de chá de açúcar", "Água com gás", "Gelo" ], instructions: [ "Amasse as folhas de hortelã com o açúcar e suco de limão", "Adicione o rum e gelo picado", "Complete com água com gás", "Mexa suavemente e decore com hortelã" ] },
        { id: 3, name: "Piña Colada Zero", description: "A versão sem álcool do clássico drink tropical com abacaxi e coco.", image: "https://images.unsplash.com/photo-1549746423-a5cb8a0b4a99?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", category: "sem-alcool", ingredients: [ "100ml de suco de abacaxi", "50ml de leite de coco", "2 colheres de sorvete de coco", "Gelo", "Fatia de abacaxi para decorar" ], instructions: [ "Bata todos os ingredientes no liquidificador", "Sirva em copo alto", "Decore com fatia de abacaxi" ] },
        { id: 4, name: "Sunset Passion", description: "Nossa criação exclusiva com vodka, maracujá e um toque de pimenta.", image: "https://images.unsplash.com/photo-1560963689-2e9c934312af?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", category: "autorais", ingredients: [ "50ml de vodka", "30ml de licor de maracujá", "20ml de suco de limão", "Xarope de pimenta a gosto", "Gelo" ], instructions: [ "Agite todos os ingredientes na coqueteleira com gelo", "Coe para um copo frostado", "Finalize com algumas gotas de xarope de pimenta" ] },
        { id: 5, name: "Old Fashioned", description: "Um clássico americano com whisky, açúcar e bitter.", image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", category: "classicos", ingredients: [ "60ml de whisky bourbon", "1 colher de chá de açúcar", "2-3 gotas de bitter", "Gelo", "Casca de laranja" ], instructions: [ "Dissolva o açúcar com o bitter e um pouco de água", "Adicione gelo e o whisky", "Mexa suavemente por 30 segundos", "Decore com casca de laranja" ] },
        { id: 6, name: "Margarita de Manga", description: "Uma versão tropical da margarita tradicional com tequila e manga.", image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", category: "tropicais", ingredients: [ "50ml de tequila", "25ml de licor de laranja", "30ml de suco de limão", "50ml de purê de manga", "Gelo", "Sal para a borda do copo" ], instructions: [ "Umedeça a borda do copo e mergulhe no sal", "Adicione todos os ingredientes na coqueteleira com gelo", "Agite vigorosamente por 15 segundos", "Coe para o copo preparado" ] }
    ];

    const carouselTrack = document.querySelector('.carousel-track');
    const trackContainer = document.querySelector('.carousel-track-container');
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const indicatorsContainer = document.getElementById('carousel-indicators');

    let filteredDrinks = [...drinks];
    let scrollTimeout;

    function renderDrinks() {
        carouselTrack.innerHTML = '';
        if (filteredDrinks.length === 0) {
            const noDrinksMessage = document.querySelector('.no-drinks-message') || document.createElement('div');
            noDrinksMessage.className = 'no-drinks-message';
            noDrinksMessage.style.display = 'block';
            noDrinksMessage.innerHTML = `<i class="fas fa-glass-cheers"></i><p>Nenhum drink encontrado nesta categoria</p>`;
            if (!carouselTrack.querySelector('.no-drinks-message')) {
                carouselTrack.appendChild(noDrinksMessage);
            }
        } else {
            filteredDrinks.forEach(drink => {
                const drinkCard = document.createElement('div');
                drinkCard.className = 'drink-card';
                drinkCard.innerHTML = `
                    <img src="${drink.image}" alt="${drink.name}" class="drink-image">
                    <div class="drink-content">
                        <h3>${drink.name}</h3>
                        <p>${drink.description}</p>
                        <button class="ver-receita">Ver Receita</button>
                    </div>`;
                drinkCard.querySelector('.ver-receita').addEventListener('click', () => showModal(drink));
                carouselTrack.appendChild(drinkCard);
            });
        }
        updateCarouselUI();
    }

    function updateCarouselUI() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const isScrollable = trackContainer.scrollWidth > trackContainer.clientWidth + 5;
            prevButton.classList.toggle('hidden', !isScrollable || trackContainer.scrollLeft <= 0);
            nextButton.classList.toggle('hidden', !isScrollable || trackContainer.scrollLeft >= trackContainer.scrollWidth - trackContainer.clientWidth - 5);
            updateIndicators();
        }, 150);
    }

    function updateIndicators() {
        indicatorsContainer.innerHTML = '';
        const itemsPerPage = Math.floor(trackContainer.clientWidth / (carouselTrack.querySelector('.drink-card')?.offsetWidth || 340));
        const totalPages = Math.ceil(filteredDrinks.length / itemsPerPage);
        
        if (totalPages <= 1) return;

        for (let i = 0; i < totalPages; i++) {
            const indicator = document.createElement('div');
            indicator.className = 'indicator';
            indicator.addEventListener('click', () => {
                const cardWidth = carouselTrack.querySelector('.drink-card')?.offsetWidth + 20;
                trackContainer.scrollTo({ left: i * itemsPerPage * cardWidth, behavior: 'smooth' });
            });
            indicatorsContainer.appendChild(indicator);
        }

        const cardWidth = carouselTrack.querySelector('.drink-card')?.offsetWidth + 20;
        const currentPage = Math.round(trackContainer.scrollLeft / (itemsPerPage * cardWidth));
        const indicators = indicatorsContainer.querySelectorAll('.indicator');
        indicators[currentPage]?.classList.add('active');
    }

    function setupFilters() {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');
                if (button.classList.contains('active')) return;
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                carouselTrack.classList.add('filtering');
                setTimeout(() => {
                    filteredDrinks = (filter === 'todos') ? [...drinks] : drinks.filter(d => d.category === filter);
                    renderDrinks();
                    trackContainer.scrollTo({ left: 0, behavior: 'instant' });
                    carouselTrack.classList.remove('filtering');
                }, 300);
            });
        });
    }

    function setupCarouselNavigation() {
        const navigate = (direction) => {
            const scrollAmount = trackContainer.clientWidth * 0.8 * (direction === 'next' ? 1 : -1);
            trackContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        };
        
        nextButton.addEventListener('click', () => navigate('next'));
        prevButton.addEventListener('click', () => navigate('prev'));
        
        trackContainer.addEventListener('scroll', updateCarouselUI);
        window.addEventListener('resize', updateCarouselUI);
    }

    function showModal(drink) {
        const modalBody = document.getElementById('modal-body');
        modalBody.innerHTML = `
            <h3>${drink.name}</h3>
            <h4>Ingredientes:</h4>
            <ul>${drink.ingredients.map(ing => `<li>${ing}</li>`).join('')}</ul>
            <h4>Modo de Preparo:</h4>
            <ol>${drink.instructions.map(step => `<li>${step}</li>`).join('')}</ol>`;
        document.getElementById('recipe-modal-container').classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function setupModal() {
        const modalContainer = document.getElementById('recipe-modal-container');
        const closeModalBtn = document.getElementById('close-modal-btn');
        
        const closeModal = () => {
            modalContainer.classList.remove('show');
            document.body.style.overflow = '';
        };
        
        closeModalBtn.addEventListener('click', closeModal);
        modalContainer.addEventListener('click', (e) => {
            if (e.target === modalContainer) closeModal();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modalContainer.classList.contains('show')) closeModal();
        });
    }

    renderDrinks();
    setupFilters();
    setupCarouselNavigation();
    setupModal();
});
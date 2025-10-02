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
// LÓGICA PRINCIPAL DA PÁGINA (CARROSSEL, FILTROS, MODAL)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const drinks = [
        { id: 1, name: "Negroni Clássico", description: "Um cocktail italiano atemporal com gin, vermute tinto e Campari.", image: "https://assets.tmecosys.com/image/upload/t_web_rdp_recipe_584x480/img/recipe/ras/Assets/1D4CCB7D-D830-4ED3-9535-875D10CFC801/Derivates/DAD3AE52-E326-4309-90BA-10F6BEEB1EC7.jpg", category: "classicos", ingredients: ["30ml de Gin", "30ml de Vermute Rosso", "30ml de Campari", "Gelo", "Lasca de laranja para decorar"], instructions: ["Encha um copo baixo com gelo", "Adicione quantidades iguais de Gin, Vermute e Campari", "Mexa suavemente por 30 segundos", "Decore com uma lasca de laranja"] },
        { id: 2, name: "Mojito Tropical", description: "Um refrescante drink cubano com rum, hortelã, limão e água com gás.", image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", category: "tropicais", ingredients: ["50ml de rum branco", "6 folhas de hortelã", "30ml de suco de limão", "2 colheres de chá de açúcar", "Água com gás", "Gelo"], instructions: ["Amasse as folhas de hortelã com o açúcar e suco de limão", "Adicione o rum e gelo picado", "Complete com água com gás", "Mexa suavemente e decore com hortelã"] },
        { id: 3, name: "Piña Colada Zero", description: "A versão sem álcool do clássico drink tropical com abacaxi e coco.", image: "https://c8.alamy.com/comp/2SPYNW3/pina-colada-cocktails-at-a-bar-2SPYNW3.jpg", category: "sem-alcool", ingredients: ["100ml de suco de abacaxi", "50ml de leite de coco", "2 colheres de sorvete de coco", "Gelo", "Fatia de abacaxi para decorar"], instructions: ["Bata todos os ingredientes no liquidificador", "Sirva em copo alto", "Decore com fatia de abacaxi"] },
        { id: 4, name: "Old Fashioned", description: "Um clássico americano com whisky, açúcar e bitter.", image: "https://pendletonwhisky.com/wp-content/uploads/2020/12/1910-oldfashioned@4x-2-1.jpg", category: "classicos", ingredients: ["60ml de whisky bourbon", "1 colher de chá de açúcar", "2-3 gotas de bitter", "Gelo", "Casca de laranja"], instructions: ["Dissolva o açúcar com o bitter e um pouco de água", "Adicione gelo e o whisky", "Mexa suavemente por 30 segundos", "Decore com casca de laranja"] },
        { id: 5, name: "Margarita de Manga", description: "Uma versão tropical da margarita tradicional com tequila e manga.", image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", category: "tropicais", ingredients: ["50ml de tequila", "25ml de licor de laranja", "30ml de suco de limão", "50ml de purê de manga", "Gelo", "Sal para a borda do copo"], instructions: ["Umedeça a borda do copo e mergulhe no sal", "Adicione todos os ingredientes na coqueteleira com gelo", "Agite vigorosamente por 15 segundos", "Coe para o copo preparado"] }
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

                // Adiciona o event listener diretamente aqui
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

    // Remove a função setupModal completamente e use este código:

    function showModal(drink) {
        const modalContainer = document.getElementById('recipe-modal-container');
        const modalBody = document.getElementById('modal-body');

        modalBody.innerHTML = `
        <h2>${drink.name}</h2>
        <h3>Ingredientes:</h3>
        <ul>${drink.ingredients.map(ing => `<li>${ing}</li>`).join('')}</ul>
        <h3>Modo de Preparo:</h3>
        <ol>${drink.instructions.map(step => `<li>${step}</li>`).join('')}</ol>`;

        // Mostrar modal
        modalContainer.classList.add('show');
        modalContainer.style.visibility = 'visible';
        modalContainer.style.opacity = '1';
        modalContainer.style.pointerEvents = 'auto';
        document.body.style.overflow = 'hidden';
    }

    // Configurar fechamento UMA VEZ (não precisa recriar)
    document.addEventListener('DOMContentLoaded', () => {
        const modalContainer = document.getElementById('recipe-modal-container');
        const closeModalBtn = document.getElementById('close-modal-btn');

        const closeModal = () => {
            modalContainer.classList.remove('show');
            modalContainer.style.visibility = 'hidden';
            modalContainer.style.opacity = '0';
            modalContainer.style.pointerEvents = 'none';
            document.body.style.overflow = '';
        };

        // Event listeners que funcionam sempre
        closeModalBtn.addEventListener('click', closeModal);

        modalContainer.addEventListener('click', (e) => {
            if (e.target === modalContainer) closeModal();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modalContainer.classList.contains('show')) {
                closeModal();
            }
        });

        // O resto do seu código (drinks array, renderDrinks, etc)...
    });

    function setupModal() {
        const modalContainer = document.getElementById('recipe-modal-container');
        const closeModalBtn = document.getElementById('close-modal-btn');

        console.log('🔧 SetupModal executado');
        console.log('Modal container:', modalContainer);
        console.log('Close button:', closeModalBtn);

        const closeModal = () => {
            console.log('🔒 Fechando modal...');
            modalContainer.classList.remove('show');
            modalContainer.style.visibility = 'hidden';
            modalContainer.style.opacity = '0';
            modalContainer.style.pointerEvents = 'none';
            document.body.style.overflow = '';
        };

        // Evento do botão fechar
        closeModalBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeModal();
        });

        // Evento de clique fora do modal
        modalContainer.addEventListener('click', (e) => {
            if (e.target === modalContainer) {
                closeModal();
            }
        });

        // Evento da tecla Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modalContainer.classList.contains('show')) {
                closeModal();
            }
        });
    }

    renderDrinks();
    setupFilters();
    setupCarouselNavigation();
    setupModal();
});
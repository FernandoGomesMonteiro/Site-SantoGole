document.addEventListener('DOMContentLoaded', () => {
    const drinks = [ /* ... seus drinks ... */ ];

    const carouselTrack = document.querySelector('.carousel-track');
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    const noDrinksMessage = document.createElement('div');
    noDrinksMessage.className = 'no-drinks-message';
    noDrinksMessage.innerHTML = `
        <i class="fas fa-glass-cheers"></i>
        <p>Nenhum drink encontrado nesta categoria</p>
    `;
    document.querySelector('.carousel-container').appendChild(noDrinksMessage);

    let currentSlide = 0;
    let visibleCards = [];
    let filteredDrinks = [...drinks];
    let cardWidth = 0;

    function initCarousel() {
        renderDrinks();
        updateCarouselPosition();

        prevButton.addEventListener('click', navigatePrev);
        nextButton.addEventListener('click', navigateNext);

        window.addEventListener('resize', () => {
            if (visibleCards.length > 0) {
                cardWidth = visibleCards[0].offsetWidth + 20;
                updateCarouselPosition();
            }
        });
    }

    function renderDrinks() {
        carouselTrack.innerHTML = '';

        if (filteredDrinks.length === 0) {
            noDrinksMessage.style.display = 'block';
            prevButton.style.display = 'none';
            nextButton.style.display = 'none';
            return;
        }

        noDrinksMessage.style.display = 'none';
        prevButton.style.display = 'flex';
        nextButton.style.display = 'flex';

        filteredDrinks.forEach(drink => {
            const drinkCard = document.createElement('div');
            drinkCard.className = 'drink-card';

            drinkCard.innerHTML = `
                <img src="${drink.image}" alt="${drink.name}" class="drink-image">
                <div class="drink-content">
                    <h3>${drink.name}</h3>
                    <p>${drink.description}</p>
                    <button class="ver-receita">Ver Receita</button>
                    <div class="detalhes-receita" style="display:none;">
                        <h4>Ingredientes:</h4>
                        <ul>
                            ${drink.ingredients.map(ing => `<li>${ing}</li>`).join('')}
                        </ul>
                        <h4>Modo de Preparo:</h4>
                        <ol>
                            ${drink.instructions.map(step => `<li>${step}</li>`).join('')}
                        </ol>
                    </div>
                </div>
            `;

            carouselTrack.appendChild(drinkCard);
        });

        document.querySelectorAll('.ver-receita').forEach(button => {
            button.addEventListener('click', function() {
                const detalhesReceita = this.nextElementSibling;

                if (detalhesReceita.style.display === 'none' || detalhesReceita.style.display === '') {
                    detalhesReceita.style.display = 'block';
                    this.textContent = 'Esconder Receita';
                } else {
                    detalhesReceita.style.display = 'none';
                    this.textContent = 'Ver Receita';
                }
            });
        });

        visibleCards = Array.from(document.querySelectorAll('.drink-card'));

        if (visibleCards.length > 0) {
            cardWidth = visibleCards[0].offsetWidth + 20;
        }
    }

    function updateCarouselPosition() {
        if (visibleCards.length === 0) {
            carouselTrack.style.transform = `translateX(0px)`;
            prevButton.disabled = true;
            nextButton.disabled = true;
            return;
        }

        const trackContainerWidth = carouselTrack.parentElement.offsetWidth;
        const totalContentWidth = visibleCards.length * cardWidth;

        let maxScroll = totalContentWidth - trackContainerWidth;
        if (maxScroll < 0) maxScroll = 0;

        const currentScroll = currentSlide * cardWidth;

        carouselTrack.style.transform = `translateX(-${currentScroll}px)`;

        prevButton.disabled = currentSlide === 0;
        nextButton.disabled = currentScroll >= maxScroll;

        if (maxScroll === 0 || visibleCards.length <= 1) {
            prevButton.disabled = true;
            nextButton.disabled = true;
        }
    }

    function navigatePrev() {
        if (currentSlide > 0) {
            currentSlide--;
            updateCarouselPosition();
        }
    }

    function navigateNext() {
        const trackContainerWidth = carouselTrack.parentElement.offsetWidth;
        const totalContentWidth = visibleCards.length * cardWidth;

        let maxScroll = totalContentWidth - trackContainerWidth;
        if (maxScroll < 0) maxScroll = 0;

        const nextScrollPosition = (currentSlide + 1) * cardWidth;

        if (nextScrollPosition <= maxScroll) {
            currentSlide++;
        } else {
            currentSlide = Math.floor(maxScroll / cardWidth);
        }

        updateCarouselPosition();
    }

    initCarousel();
});

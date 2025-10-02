
document.addEventListener("DOMContentLoaded", () => {
    const footer = ` <footer id="contato" class="footer">
        <div class="footer-content">
            <div class="footer-logo">
                <h3>Santo<span>Gole</span></h3>
                <p>Elevando a arte da coquetelaria</p>
                <div class="social-links">
                    <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                        <i class="fab fa-instagram"></i>
                    </a>
                    <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                        <i class="fab fa-facebook-f"></i>
                    </a>
                    <a href="https://youtube.com/" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                        <i class="fab fa-youtube"></i>
                    </a>
                </div>
            </div>


            <div class="footer-links">
                <h4>Explorar</h4>
                <ul>
                    <li><a href="catalogo.html">Receitas</a></li>
                </ul>
            </div>

            <div class="footer-links">
                <h4>Contato</h4>
                <ul>
                    <li><a href="sobre.html">Sobre nós</a></li>
                    <li> <a href="https://wa.me/5541997322885" target="_blank" rel="noopener noreferrer">
            <i class="fab fa-whatsapp"></i> (41) 99732-2885
        </a></li>
                </ul>
            </div>
        </div>

        <div class="copyright-area">
            <p>&copy; 2025 SantoGole. Todos os direitos reservados.</p>
        </div>
    </footer> `;

    // Cria o container e injeta no final do body
    document.body.insertAdjacentHTML("beforeend", footer);




});
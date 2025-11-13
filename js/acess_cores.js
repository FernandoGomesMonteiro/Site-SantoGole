const toggleBtn = document.getElementById('toggle-theme');

toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');

    if (document.body.classList.contains('dark-mode')) {
        toggleBtn.textContent = '☀️';
    } else {
        toggleBtn.textContent = '🌙';
    }
});

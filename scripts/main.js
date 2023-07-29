// BANNER
async function fetchJsonData() {
    try {
        const response = await fetch('filmes.json');
        const data = await response.json();
        return data.filmes;
    } catch (error) {
        console.error('Error fetching JSON data:', error);
    }
}

// Function to create the carousel items from JSON data
function createCarouselItems(data) {
    const carouselInner = document.getElementById('carouselInner');
    for (const uuid in data) {
        const filme = data[uuid];
        const carouselItem = document.createElement('div');
        carouselItem.classList.add('carousel-item');

        const img = document.createElement('img');
        img.src = filme['banner-loc'];
        img.alt = filme.titulo;
        img.classList.add('d-block', 'w-100');

        const carouselCaption = document.createElement('div');
        carouselCaption.classList.add('carousel-caption');

        const h1 = document.createElement('h1');
        h1.textContent = filme.titulo;

        const p1 = document.createElement('p');
        p1.classList.add('small');
        p1.textContent = `${filme.tempo} - CLASS. ${filme.class} - EM CARTAZ ATÉ ${filme.fim}`;

        const p2 = document.createElement('p');
        p2.textContent = filme.sinopse;

        const carouselBtn = document.createElement('div');
        carouselBtn.classList.add('carousel-btn');

        const link = document.createElement('a');
        link.href = '#prog';
        link.classList.add('btn');
        link.textContent = 'Ver Sessões';

        carouselBtn.appendChild(link);
        carouselCaption.appendChild(h1);
        carouselCaption.appendChild(p1);
        carouselCaption.appendChild(p2);
        carouselCaption.appendChild(carouselBtn);
        carouselItem.appendChild(img);
        carouselItem.appendChild(carouselCaption);
        carouselInner.appendChild(carouselItem);
    }
}

// Load JSON data and create carousel items when the document is ready
document.addEventListener('DOMContentLoaded', async () => {
    const jsonData = await fetchJsonData();
    createCarouselItems(jsonData);
    // Set the first carousel item as active
    document.querySelector('.carousel-item').classList.add('active');
    
});

// DATAS ATUALIZADAS
// Variables
const dateItemsContainer = document.getElementById('dateCarousel');
const dateItems = dateItemsContainer.querySelectorAll('.date-item');
let currentDateIndex = 0;

// Function to generate dates from today to the next 6 days
function generateDates() {
    const today = new Date();
    for (let i = 0; i <= 6; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dateString = `${date.getDate()}/${date.getMonth() + 1}`;
        const dayOfWeek = getDayOfWeek(date.getDay());
        dateItems[i].innerHTML = `${dateString}<br><span>${dayOfWeek}</span>`;
        dateItems[i].setAttribute('id',dayOfWeek)
    }
}

// Function to get the day of the week in Portuguese
function getDayOfWeek(dayNumber) {
    const daysOfWeek = ["dom", "seg", "ter", "qua", "qui", "sex", "sab"];
    return daysOfWeek[dayNumber];
}

// Function to select a specific date
function selectDate(index) {
    currentDateIndex = index;
    updateActiveDate();
}

// Function to change the date by navigating previous or next
function changeDate(offset) {
    currentDateIndex += offset;
    if (currentDateIndex < 0) {
        currentDateIndex = 6;
    } else if (currentDateIndex >= 7) {
        currentDateIndex = 0;
    }
    updateActiveDate();
}

// Function to update the active date
function updateActiveDate() {
    dateItems.forEach((item, index) => {
        item.classList.toggle('active', index === currentDateIndex);
    });
    createFilmesElements()
}

// Initial setup
generateDates();
updateActiveDate();

let filmesData; // Variável global para armazenar os dados do JSON

// Function to generate the HTML for each filme for a specific dia and sala
function generateFilmeElement(filme, dia) {
    const filmeElement = document.createElement("div");
    filmeElement.className = "filme";

    filmeElement.innerHTML = `
    <div class="cartaz">
      <img src="${filme['poster-loc']}" alt="Poster ${filme.titulo}" class="img-cartaz">
    </div>
    <div class="dados">
      <h3>${filme.titulo}</h3>
      <div class="sessao">
        ${generateSessionHTML(filme.sessoes[dia])}
      </div>
    </div>
  `;

    return filmeElement;
}

// Function to generate the HTML for each sessao for a specific dia and sala
function generateSessionHTML(sessoes) {
    let sessionHTML = "";
    for (const sala in sessoes) {
        const horarios = sessoes[sala].horarios.map((horario) => `<span class="numero borda">${horario}</span>`).join("");
        const tipoAudio = `<span class="p18 esp uppr">${sessoes[sala].tipo} ${sessoes[sala].audio}</span>`;
        sessionHTML += `<span class="p18 sala capt">${sala}</span> ${horarios} ${tipoAudio} <br>`;
    }
    return sessionHTML;
}

// Função para adicionar os elementos filmes ao prog-box
async function createFilmesElements() {
    filmesData = await fetchJsonData(); // Utiliza a função fetchJsonData existente
    if (!filmesData) return;

    const diaAtual = dateItems.item(currentDateIndex).id;
    
    const progBox = document.getElementById("prog-box");
    progBox.innerHTML = ""; // Clear existing content before re-generating

    for (const filmeId in filmesData) {
        const filme = filmesData[filmeId];
        if (filme.sessoes[diaAtual]) {
            const filmeElement = generateFilmeElement(filme, diaAtual);
            progBox.appendChild(filmeElement);
        }
    }
}
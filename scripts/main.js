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
    const today = new Date();

    for (const uuid in data) {
        const filme = data[uuid];
        const estreiaDateParts = filme.estreia.split('/');
        const estreiaDate = new Date(estreiaDateParts[2], estreiaDateParts[1] - 1, estreiaDateParts[0]);
        const fimDateParts = filme.fim.split('/');
        const fimDate = new Date(fimDateParts[2], fimDateParts[1] - 1, fimDateParts[0]);

        if (estreiaDate <= today && fimDate >= today) {
            const carouselItem = document.createElement('div');
            carouselItem.classList.add('carousel-item');

            const img = document.createElement('img');
            img.src = `images/${filme.uuid}_banner.jpg`;
            img.alt = filme.titulo;
            img.classList.add('d-block', 'w-100');

            const carouselCaption = document.createElement('div');
            carouselCaption.classList.add('carousel-caption');

            const h1 = document.createElement('h1');
            h1.textContent = filme.titulo;

            const p1 = document.createElement('p');
            p1.classList.add('small');
            p1.textContent = `${filme.tempo} • CLASS. ${filme.class} • EM CARTAZ ATÉ ${filme.fim}`;

            const p2 = document.createElement('p');
            p2.className = "sinopse";
            p2.textContent = filme.sinopse;

            const carouselBtn = document.createElement('div');
            carouselBtn.classList.add('carousel-btn');

            const link = document.createElement('a');
            link.href = '#prog';
            link.classList.add('btn');
            link.textContent = 'Ver Sessões';

            carouselBtn.appendChild(link);
            carouselCaption.appendChild(carouselBtn);
            carouselCaption.appendChild(h1);
            carouselCaption.appendChild(p1);
            carouselCaption.appendChild(p2);
            carouselItem.appendChild(img);
            carouselItem.appendChild(carouselCaption);
            carouselInner.appendChild(carouselItem);
        }
    }
}

// Load JSON data and create carousel items when the document is ready
document.addEventListener('DOMContentLoaded', async () => {
    const jsonData = await fetchJsonData();
    
    createCarouselItems(jsonData);
    document.querySelector('.carousel-item').classList.add('active');
    
    createFutureFilmElements();
});

document.addEventListener("DOMContentLoaded", function () {
    // Get all anchor tags with the class "openModal"
    const openModalLinks = document.querySelectorAll(".openModal");

    // Get the modal and the modal body element
    const modal = document.getElementById("myModal");
    const modalBody = modal.querySelector(".modal-body");

    // Attach click event listener to each anchor tag
    openModalLinks.forEach((link) => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            // Get the content ID from the data-content-id attribute
            const contentID = this.dataset.contentId;
            // Use the content ID to fetch the content or generate it
             // You need to implement this function to get the content based on the ID
            // Update the modal body with the content
            modalBody.innerHTML = getContentById(contentID);

            // Show the modal
            const bootstrapModal = new bootstrap.Modal(modal);
            bootstrapModal.show();
        });
    });
});

// Example function to fetch content based on the ID (You can modify this according to your needs)
function getContentById(contentID) {
    // Example: assuming you have an object with content based on IDs
    const contentMap = {
        contentID1: "<p>This is the content for Modal 1.</p>",
        contentID2: "<p>This is the content for Modal 2.</p>",
        contentID3: "<p>This is the content for Modal 3.</p>",
    };
    return contentMap[contentID] || "<p>No content found for this ID.</p>";
}

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
      <a href="javascript:void(0)" class="openModal">
        <img src="images/${filme.uuid}_poster.jpg" alt="Poster de ${filme.titulo}" class="img-cartaz">
      </a>
    </div>
    <div class="dados">
      <h3>${filme.titulo}</h3>
      <div class="sessoes">
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
        const horarios = sessoes[sala].horarios
            .map((horario) => `<span class="numero">${horario}</span>`)
            .join("");
        const tipoAudio = `<span class="p18 esp uppr">${sessoes[sala].tipo} ${sessoes[sala].audio}</span>`;
        sessionHTML += `
      <div class="sessao">
        <span class="p18 sala capt">${sala}</span>
        <div class="horarios">${horarios}</div>
        ${tipoAudio}
      </div>
    `;
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

    const today = new Date();
    for (const filmeId in filmesData) {
        const filme = filmesData[filmeId];
        const estreiaDateParts = filme.estreia.split('/');
        const estreiaDate = new Date(estreiaDateParts[2], estreiaDateParts[1] - 1, estreiaDateParts[0]);
        const fimDateParts = filme.fim.split('/');
        const fimDate = new Date(fimDateParts[2], fimDateParts[1] - 1, fimDateParts[0]);

        if (estreiaDate <= today && fimDate >= today && filme.sessoes[diaAtual]) {
            const filmeElement = generateFilmeElement(filme, diaAtual);
            progBox.appendChild(filmeElement);
        }
    }
}

function createFutureFilmElements() {
    const cartazesDiv = document.getElementById("em-breve-elements");

    // Get today's date
    const today = new Date();

    // Filter and sort the films based on "estreia" date
    const futureFilmes = Object.values(filmesData).filter(filme => {
        const inicioDateParts = filme.estreia.split("/");
        const inicioDate = new Date(inicioDateParts[2], inicioDateParts[1] - 1, inicioDateParts[0]);
        return inicioDate > today;
    }).sort((a, b) => {
        const aInicioDateParts = a.estreia.split("/");
        const bInicioDateParts = b.estreia.split("/");
        const aInicioDate = new Date(aInicioDateParts[2], aInicioDateParts[1] - 1, aInicioDateParts[0]);
        const bInicioDate = new Date(bInicioDateParts[2], bInicioDateParts[1] - 1, bInicioDateParts[0]);
        return aInicioDate - bInicioDate;
    });

    // Clear existing content before re-generating
    cartazesDiv.innerHTML = "";
    let first = true;

    for (const filme of futureFilmes) {
        const filmElement = document.createElement("a");
        filmElement.href = "javascript:void(0)";
        filmElement.className = "openModal";
        filmElement.setAttribute('data-content-id',"contentID1")
        filmElement.innerHTML = `
            <div class="cartaz">
                <img src="images/${filme.uuid}_poster.jpg" alt="Poster de ${filme.titulo}" class="img-cartaz">
                ${filme["pre-estreia"] ? '<div class="pre-estreia"><p><bold>PR&Eacute;-ESTREIA DISPON&Iacute;VEL</bold></p></div>' : ''}
                <h2 class="cartaz-texto titulo">${filme.titulo}</h2>
                <h2 class="cartaz-texto">${filme.estreia}</h2>
            </div>
        `;
        cartazesDiv.appendChild(filmElement);
        
        if(first) {
            first = false;
            const bannerBreveElement = document.getElementById("banner-breve");
            const linearGradient = "linear-gradient(0deg, rgba(40, 22, 109, 0.50) 0%, rgba(40, 22, 109, 0.50) 100%)";
            const imageUrl = `url('images/${filme.uuid}_banner.jpg')`;

            bannerBreveElement.style.backgroundImage = `${linearGradient}, ${imageUrl}`;
        }
    }
}

fetch('faq.json')
    .then(response => response.json())
    .then(data => {
        const accordionContainer = document.getElementById("accordionExample");

        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const item = data[key];

                // Create the accordion item elements
                const accordionItem = document.createElement("div");
                accordionItem.className = "accordion-item";

                const accordionHeader = document.createElement("h2");
                accordionHeader.className = "accordion-header";
                accordionHeader.id = "heading" + key;

                const accordionButton = document.createElement("button");
                accordionButton.className = "accordion-button";
                accordionButton.type = "button";
                accordionButton.setAttribute("data-bs-toggle", "collapse");
                accordionButton.setAttribute("data-bs-target", "#collapse" + key);
                accordionButton.setAttribute("aria-expanded", "false");

                accordionButton.textContent = item.pergunta;

                const accordionCollapse = document.createElement("div");
                accordionCollapse.id = "collapse" + key;
                accordionCollapse.className = "accordion-collapse collapse";
                accordionCollapse.setAttribute("aria-labelledby", "heading" + key);
                accordionCollapse.setAttribute("data-bs-parent", "#accordionExample");

                const accordionBody = document.createElement("div");
                accordionBody.className = "accordion-body";
                accordionBody.textContent = item.resposta;

                // Append the elements to the accordion container
                accordionHeader.appendChild(accordionButton);
                accordionItem.appendChild(accordionHeader);
                accordionCollapse.appendChild(accordionBody);
                accordionItem.appendChild(accordionCollapse);
                accordionContainer.appendChild(accordionItem);
            }
        }
    })
    .catch(error => console.error('Error fetching FAQ JSON:', error));
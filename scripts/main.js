async function fetchJsonData() {
    try {
        const response = await fetch('filmes.json');
        const data = await response.json();
        return data.filmes;
    } catch (error) {
        console.error('Error fetching JSON data:', error);
    }
}

async function getDiasFechados() {
    try {
        const response = await fetch('config.json');
        const data = await response.json();
        return data['diasfechados'];
    }catch (error) {
        console.error("Impossível ler o arquivo:",error)
    }
}

// criar os itens do carrossel
function createCarouselItems(data) {
    const carouselInner = document.getElementById('carouselInner');
    const today = new Date();
    let slideId = 0;

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
            carouselCaption.classList.add('carousel-caption','container','mt-4');

            const h1 = document.createElement('h1');
            h1.textContent = filme.titulo;

            const p1 = document.createElement('p');
            p1.classList.add('small');
            p1.style.paddingTop = '5px';
            p1.innerHTML = `${filme.tempo} • <span class="class-${filme.class}">${filme.class}</span> • EM CARTAZ ATÉ ${filme.fim}`;

            const p2 = document.createElement('p');
            p2.className = "sinopse";
            p2.textContent = filme.sinopse;

            const carouselBtn = document.createElement('div');
            carouselBtn.classList.add('carousel-btn');

            const link = document.createElement('a');
            link.href = '#prog';
            link.classList.add('btn');
            link.textContent = 'Ver Sessões';

            const novoBotao = document.createElement("button");

            novoBotao.setAttribute("type", "button");
            novoBotao.setAttribute("data-bs-target", "#filmCarousel");
            
            if(slideId === 0) {
                novoBotao.setAttribute("class", "active");
                novoBotao.setAttribute("aria-current", "true");
            }
            
            novoBotao.setAttribute("data-bs-slide-to", slideId);
            slideId = slideId+1;

            novoBotao.setAttribute("aria-label", `Slide ${slideId}`);
            document.getElementById("carousel-indicators").appendChild(novoBotao);

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
document.addEventListener('DOMContentLoaded', async () => {
    const jsonData = await fetchJsonData();
    
    createCarouselItems(jsonData);
    document.querySelector('.carousel-item').classList.add('active');
    
    createFutureFilmElements();
});

const dateItemsContainer = document.getElementById('dateCarousel');
const dateItems = dateItemsContainer.querySelectorAll('.date-item');
let currentDateIndex = 0;

// gerar os próximos dias
function generateDates() {
    const today = new Date();
    for (let i = 0; i <= 6; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const dateString = `${day}/${month}`;
        const dayOfWeek = getDayOfWeek(date.getDay());
        dateItems[i].innerHTML = `${dateString}<br><span>${dayOfWeek}</span>`;
        dateItems[i].setAttribute('id',dayOfWeek)
        dateItems[i].setAttribute('date-string',dateString+`/${date.getFullYear()}`)
    }
}
function getDayOfWeek(dayNumber) {
    const daysOfWeek = ["dom", "seg", "ter", "qua", "qui", "sex", "sab"];
    return daysOfWeek[dayNumber];
}
function selectDate(index) {
    currentDateIndex = index;
    updateActiveDate();
}
function changeDate(offset) {
    currentDateIndex += offset;
    if (currentDateIndex < 0) {
        currentDateIndex = 6;
    } else if (currentDateIndex >= 7) {
        currentDateIndex = 0;
    }
    updateActiveDate();
}
function updateActiveDate() {
    dateItems.forEach((item, index) => {
        item.classList.toggle('active', index === currentDateIndex);
    });
    createFilmesElements()
}

generateDates();
updateActiveDate();

let filmesData;

// cria o elemento filme em cartaz
function generateFilmeElement(filme, dia) {
    const filmeElement = document.createElement("div");
    filmeElement.className = "container-fluid mt-4 filme-bg";
    filmeElement.setAttribute("style","background: linear-gradient(0deg, rgba(84, 61, 178, 0.50) 0%, rgba(84, 61, 178, 0.50) 100%), linear-gradient(0deg, rgba(2, 0, 36, 0.50) 0%, rgba(2, 0, 36, 0.50) 100%), url(images/"+filme.uuid+"_banner.jpg); background-size: cover; background-position: center;")

    filmeElement.innerHTML = `
<div class="container">
    <div class="row mb-3 text-start">
        <div class="col-lg-7">
            <div class="container" style="padding-top: 32px; padding-bottom: 32px">
                <div class="row align-items-center">
                    <div class="col-sm-4">
                        <div class="dropshadow openModal d-none d-sm-block" role="button" data-bs-toggle="modal" data-bs-target="#infoModal" data-bs-uuid="${filme.uuid}">
                            <img src="images/${filme.uuid}_poster.jpg" alt="Poster de ${filme.titulo}" style="width: 100%; max-width: 100%; max-height: 100%; height: auto;">
                        </div>
                    </div>
                    <div class="col-sm-8">
                        <h1>${filme.titulo}</h1>
                        <span class="class-${filme.class} d-none d-lg-inline" style="padding-top: 5px;">${filme.class}</span>
                        <div class="d-flex justify-content-between align-items-center d-lg-none mb-3">
                            <p style="padding-top: 5px" class="small d-inline">${filme.tempo} &bull; <span class="class-${filme.class}">${filme.class}</span> &bull; EM CARTAZ AT&Eacute; ${filme.fim}</p>
                            <a class="info-desktop openModal col-2 d-inline" aria-label="Ver informações sobre o filme" data-bs-toggle="modal" data-bs-target="#infoModal" data-bs-uuid="${filme.uuid}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="26" viewBox="0 0 25 25" fill="none">
                                    <path d="M11.25 6.27621H13.75V8.77621H11.25V6.27621ZM11.25 11.2762H13.75V18.7762H11.25V11.2762ZM12.5 0.0262146C5.6 0.0262146 0 5.62621 0 12.5262C0 19.4262 5.6 25.0262 12.5 25.0262C19.4 25.0262 25 19.4262 25 12.5262C25 5.62621 19.4 0.0262146 12.5 0.0262146ZM12.5 22.5262C6.9875 22.5262 2.5 18.0387 2.5 12.5262C2.5 7.01371 6.9875 2.52621 12.5 2.52621C18.0125 2.52621 22.5 7.01371 22.5 12.5262C22.5 18.0387 18.0125 22.5262 12.5 22.5262Z" fill="#F8EBFF"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="mb-3">
                    ${generateSessionHTML(filme.sessoes[dia])}
                </div>
            </div>
        </div>
        <div class="col-lg-5 d-none d-lg-block">
            <div class="container" style="padding-bottom: 32px; padding-top: 32px;">
                <div style="position: relative; width: 100%; height: 0; padding-bottom: 56.25%;">
                    <iframe src="https://www.youtube-nocookie.com/embed/${filme.trailer}" allowfullscreen style="position: absolute; width: 100%; height: 100%; top: 0; left: 0;"></iframe>
                </div>
                <p class="text-center" style="padding-bottom: 32px; padding-top: 16px">${filme.tempo} &bull; EM CARTAZ AT&Eacute; ${filme.fim}</p>
                <p>${filme.sinopse}</p>
                <span class="small" style="font-size:15px;"><strong>MAIS INFORMA&Ccedil;&Otilde;ES:</strong></span><br>
                <span class="small"><strong>DIRE&Ccedil;&Atilde;O:</strong> ${filme.direcao} | <strong>ROTEIRO:</strong> ${filme.roteiro} | <strong>ATORES:</strong> ${filme.atores} | <strong>G&Ecirc;NERO:</strong> ${filme.genero} | <strong>IMDB:</strong> ${filme.imdb}</span>
            </div>
        </div>
    </div>
</div>
  `;

    return filmeElement;
}

// gera informações da sessão
function generateSessionHTML(sessoes) {
    let sessionHTML = "";
    for (const sala in sessoes) {
        const horarios = sessoes[sala].horarios
            .map((horario) => `<span class="numero tag-border block-text">${horario}</span>`)
            .join(" ");
        const tipoAudio = `<p class="tag capt d-inline block-text">${sessoes[sala].audio}</p> <p class="tag uppr d-inline block-text">${sessoes[sala].tipo}</p>`;
        sessionHTML += `
      <div class="d-block" style="padding-top: 64px;">
                    <h2 style="padding-right: 16px" class="capt d-inline">${sala}</h2>
                    ${tipoAudio}
                </div>
                <div class="d-block block-text" style="padding-top: 12px">
                    ${horarios}
                </div>
    `;
    }
    return sessionHTML;
}
// adiciona os filmes à programação
async function createFilmesElements() {
    filmesData = await fetchJsonData();
    if (!filmesData) return;
    
    const diaAtual = dateItems.item(currentDateIndex).id;
    const diaCal = dateItems.item(currentDateIndex).getAttribute('date-string');
    const programacao = document.getElementById("programacao");

    const diasFechados = await getDiasFechados();
    
    if (diasFechados && Array.isArray(diasFechados) && diasFechados.includes(diaCal)) {
        programacao.innerHTML = '<div class="container-fluid" style="background-color: #543DB2; margin-top: 24px">' +
            '    <div class="container text-center" style="padding-top: 64px; padding-bottom: 128px">' +
            '        <h1>Infelizmente n&atilde;o h&aacute; nenhuma sess&atilde;o programada para esse dia</h1>' +
            '        <h2>Por favor, selecione outra data para conferir a programa&ccedil;&atilde;o</h2>' +
            '    </div>' +
            '    </div>';
        return;
    }
    
    programacao.innerHTML = "";

    const today = new Date();
    for (const filmeId in filmesData) {
        const filme = filmesData[filmeId];
        const estreiaDateParts = filme.estreia.split('/');
        const estreiaDate = new Date(estreiaDateParts[2], estreiaDateParts[1] - 1, estreiaDateParts[0]);
        const fimDateParts = filme.fim.split('/');
        const fimDate = new Date(fimDateParts[2], fimDateParts[1] - 1, fimDateParts[0]);

        if (estreiaDate <= today && fimDate >= today && filme.sessoes[diaAtual]) {
            const filmeElement = generateFilmeElement(filme, diaAtual);
            programacao.appendChild(filmeElement);
        }
    }
}

// cria elemento de filmes futuros
function createFutureFilmElements() {
    const cartazesDiv = document.getElementById("em-breve-elements");

    const today = new Date();

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
    
    cartazesDiv.innerHTML = "";
    let first = true;

    for (const filme of futureFilmes) {
        const filmElement = document.createElement("a");
        filmElement.setAttribute('data-bs-toggle',"modal")
        filmElement.setAttribute('data-bs-target',"#infoModal")
        filmElement.setAttribute('data-bs-uuid',filme.uuid)

        filmElement.innerHTML = `
            <div class="cartaz">
                <div class="image-container openModal">
                    <img src="images/${filme.uuid}_poster.jpg" alt="Poster de ${filme.titulo}" class="img-cartaz">
                    <p class="cartaz-detalhes">ver detalhes</p>
                </div>
                ${filme["pre-estreia"] ? '<div class="pre-estreia block-text"><p><strong>PR&Eacute;-ESTREIA DISPON&Iacute;VEL</strong></p></div>' : ''}
                <h2 class="cartaz-texto titulo"><strong>${filme.titulo}</strong></h2>
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

// criar accordion de faq
fetch('config.json')
    .then(response => response.json())
    .then(data => {
        const accordionContainer = document.getElementById("accordionFAQ");

        for (const key in data['faq']) {
            if (data['faq'].hasOwnProperty(key)) {
                const item = data['faq'][key];

                // Create the accordion item elements
                const accordionItem = document.createElement("div");
                accordionItem.className = "accordion-item";

                const accordionHeader = document.createElement("h2");
                accordionHeader.className = "accordion-header";
                accordionHeader.id = "heading" + key;

                const accordionButton = document.createElement("button");
                accordionButton.className = "accordion-button collapsed";
                accordionButton.type = "button";
                accordionButton.setAttribute("data-bs-toggle", "collapse");
                accordionButton.setAttribute("data-bs-target", "#collapse" + key);
                accordionButton.setAttribute("aria-expanded", "false");

                accordionButton.textContent = item.pergunta;

                const accordionCollapse = document.createElement("div");
                accordionCollapse.id = "collapse" + key;
                accordionCollapse.className = "accordion-collapse collapse";
                accordionCollapse.setAttribute("aria-labelledby", "heading" + key);
                accordionCollapse.setAttribute("data-bs-parent", "#accordionFAQ");

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

// atualizar modal conforme o filme selecionado
const infoModal = document.getElementById('infoModal')
if (infoModal) {
    infoModal.addEventListener('show.bs.modal', event => {
        const button = event.relatedTarget
        const uuid = button.getAttribute('data-bs-uuid')

        let info = document.getElementById("filmeInfoModal")
        let filme = filmesData[uuid];

        info.innerHTML = `
            <div class="col" style="max-width: 570px;">
                <h1>${filme.titulo}</h1>
                <p class="small">${filme.tempo} &bull; <span class="class-${filme.class}">${filme.class}</span> &bull; EM CARTAZ AT&Eacute; ${filme.fim}</p>
                <p>${filme.sinopse}</p>
                <span class="small" style="font-size=15px"><strong>MAIS INFORMA&Ccedil;&Otilde;ES:</strong></span><br>
                    <span class="small"><strong>DIRE&Ccedil;&Atilde;O:</strong> ${filme.direcao} | <strong>ROTEIRO:</strong> ${filme.roteiro} | <strong>ATORES:</strong> ${filme.atores} | <strong>G&Ecirc;NERO:</strong> ${filme.genero} | <strong>IMDB:</strong> ${filme.imdb}</span>
            </div>
            <div class="col-lg-6 ms-md-3 mx-auto" style="padding-top: 56.25%; position: relative;">
                <iframe src="https://www.youtube-nocookie.com/embed/${filme.trailer}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; max-height: 440px;" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
            </div>
        `;
    })
}

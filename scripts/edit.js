async function fetchJsonData() {
    try {
        const response = await fetch('filmes.json');
        const data = await response.json();
        return data.filmes;
    } catch (error) {
        console.error('Error fetching JSON data:', error);
    }
}

let filmesData;

document.addEventListener('DOMContentLoaded', async function () {
    filmesData = await fetchJsonData();

    let lista = document.getElementById("listaFilmes");

    for (const filmeId in filmesData) {
        let element = document.createElement("a");
        element.innerHTML = `
    <a data-bs-toggle="modal" data-bs-target="#filmModal" data-bs-uuid="${filmesData[filmeId].uuid}" class="list-group-item list-group-item-action">
        ${filmesData[filmeId].titulo}
    </a>`
        lista.appendChild(element);

    }
});

function formatDate(date) {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 because months are 0-based
    const year = d.getFullYear().toString();
    return `${day}/${month}/${year}`;
}

$('input[name="daterange"]').daterangepicker({
    "minDate": formatDate(Date.now()),
    "autoApply": true,
    "locale": {
        "format": "DD/MM/YYYY",
        "separator": "       |       ",
        "fromLabel": "de",
        "toLabel": "até",
        "weekLabel": "W",
        "daysOfWeek": [
            "Dom",
            "Seg",
            "Ter",
            "Qua",
            "Qui",
            "Sex",
            "Sab"
        ],
        "monthNames": [
            "Janeiro",
            "Fevereiro",
            "Março",
            "Abril",
            "Maio",
            "Junho",
            "Julho",
            "Agosto",
            "Setembro",
            "Outubro",
            "Novembro",
            "Dezembro"
        ],
        "firstDay": 1
    }
}, function(start, end, label) {
});

function changeEditDate(selectedIndex) {
    const buttons = document.querySelectorAll('.dia-item');

    buttons.forEach((button, index) => {
        if (index === selectedIndex) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

// update modal
const filmModal = document.getElementById('filmModal')
if (filmModal) {
    filmModal.addEventListener('show.bs.modal', event => {
        const button = event.relatedTarget
        const uuid = button.getAttribute('data-bs-uuid')

        let info = document.getElementById("filmModalContent")
        let filme = filmesData[uuid];

        info.innerHTML = `
                        <div class="modal-header">
                <h1 class="modal-title fs-5">Informa&ccedil;&otilde;es do Filme</h1>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <section>
                    <div class="row">
                        <div class="col-8">
                            <div class="form-floating">
                                <input value="${filme.titulo}" class="form-control" placeholder=" " id="titulo">
                                <label for="titulo">T&iacute;tulo</label>
                            </div>
                        </div>
                        <div class="col-3">
                            <button class="btn">Importar Dados</button>
                        </div>
                    </div>
                </section>

                <section>
                    <div class="form-floating">
                        <textarea class="form-control" placeholder=" " id="sinopse" style="height: 175px">${filme.sinopse}</textarea>
                        <label for="sinopse">Sinopse</label>
                    </div>
                </section>

                <section>
                    <h2>Dados</h2>
                    <div class="row g-2">
                        <span class="small">sobre o filme</span>
                        <div class="col-2">
                            <div class="form-floating">
                                <input value="${filme.tempo}" class="form-control" placeholder=" " id="tmp"></textarea>
                                <label for="tmp">Dura&ccedil;&atilde;o</label>
                            </div>
                        </div>
                        <div class="col-5">
                            <div class="form-floating">
                                <input value="${filme.genero}" class="form-control" placeholder=" " id="gen"></textarea>
                                <label for="gen">G&ecirc;nero</label>
                            </div>
                        </div>
                        <div class="col-3">
                            <div class="form-floating">
                                <select class="form-select" id="clas">
                                    <option selected>Livre</option>
                                    <option value="1">10 anos</option>
                                    <option value="2">12 anos</option>
                                    <option value="3">14 anos</option>
                                    <option value="4">16 anos</option>
                                    <option value="5">18 anos</option>
                                </select>
                                <label for="clas">Classifica&ccedil;&atilde;o</label>
                            </div>
                        </div>
                        <div class="col-2">
                            <div class="form-floating">
                                <input value="${filme.imdb}" class="form-control" placeholder=" " id="imdb"></textarea>
                                <label for="imdb">IMDb</label>
                            </div>
                        </div>
                    </div>
                    <span class="small">sobre a produ&ccedil;&atilde;o</span>
                    <div class="row g-2">
                        <div class="col-6">
                            <div class="form-floating">
                                <input value="${filme.direcao}" class="form-control" placeholder=" " id="dir"></textarea>
                                <label for="dir">Dire&ccedil;&atilde;o</label>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="form-floating">
                                <input value="${filme.roteiro}" class="form-control" placeholder=" " id="rot"></textarea>
                                <label for="rot">Roteiro</label>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="form-floating">
                                <input value="${filme.atores}" class="form-control" placeholder=" " id="atr"></textarea>
                                <label for="atr">Atores</label>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="form-floating">
                                <input value="${filme.trailer}" class="form-control" placeholder=" " id="trl"></textarea>
                                <label for="trl">Trailer</label>
                            </div>
                        </div>
                    </div>
                </section>

                <section>
                    <h2>Datas</h2>
                    <div class="row g-2">
                        <div class="col">
                            <div style="display: flex; justify-content: space-between; align-items: center; padding-left: 32px; padding-right: 32px">
                                <span class="small">Data de estreia</span>
                                <span class="small">Data de encerramento</span>
                            </div>
                            <input class="form-control" style="text-align: center" type="text"  name="daterange" readonly>
                        </div>
                        <div class="col">
                            <div class="form-check form-switch form-check-reverse">
                                <input class="form-check-input" type="checkbox" role="switch" id="preestr">
                                <label class="form-check-label" for="preestr"><h5>Habilitar pre-estreia</h5></label>
                            </div>
                        </div>
                    </div>
                </section>

                <section>
                    <h2>Imagens do Site</h2>
                    <div class="row">
                        <div class="col">
                            <span class="small pd16">Imagem de Poster</span>
                            <input class="form-control" type="file" id="posterFile">
                        </div>
                        <div class="col">
                            <span class="small pd16">Imagem de Banner</span>
                            <input class="form-control" type="file" id="bannerFile">
                        </div>
                    </div>
                </section>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                <button type="button" class="btn btn-primary">Salvar Altera&ccedil;&otilde;es</button>
            </div>
        `;
    })
}
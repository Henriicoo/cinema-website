const filmesContainer = document.getElementById('filmes-container');
const addFilmeForm = document.getElementById('add-filme-form');

// Function to fetch and display the filmes data
async function fetchFilmesData() {
    try {
        const response = await fetch('filmes.json');
        const data = await response.json();

        // Display the filmes data on the page
        for (const uuid in data.filmes) {
            const filme = data.filmes[uuid];
            const filmeInfo = document.createElement('div');
            filmeInfo.innerHTML = `
        <h3>${filme.titulo}</h3>
        <p>Sinopse: ${filme.sinopse}</p>
        <!-- Display other filme properties as needed -->
        <button onclick="editFilme('${uuid}')">Editar</button>
        <button onclick="removeFilme('${uuid}')">Remover</button>
      `;
            filmesContainer.appendChild(filmeInfo);
        }
    } catch (error) {
        console.error('Error fetching filmes data:', error);
    }
}

// Function to add a new filme to filmes.json
function addFilme(event) {
    event.preventDefault();
    const formData = new FormData(addFilmeForm);
    const newFilme = {};

    formData.forEach((value, key) => {
        newFilme[key] = value;
    });

    // Here you can perform additional validation and sanitization of the data

    // Add the new filme data to filmes.json (using a server-side script like PHP)
    // ...

    // After adding the new filme, refresh the page to display the updated data
    window.location.reload();
}

// Function to edit an existing filme in filmes.json
function editFilme(uuid) {
    // Implement the logic to edit the filme data (using a server-side script like PHP)
    // ...
}

// Function to remove an existing filme from filmes.json
function removeFilme(uuid) {
    // Implement the logic to remove the filme data (using a server-side script like PHP)
    // ...
}

// Fetch and display the filmes data when the document is ready
document.addEventListener('DOMContentLoaded', fetchFilmesData);

// Event listener to handle form submission for adding a new filme
addFilmeForm.addEventListener('submit', addFilme);
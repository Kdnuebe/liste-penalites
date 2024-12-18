let penalitesData = [];

// Charger les données depuis penalites.json
fetch('penalites.json')
  .then(response => response.json())
  .then(data => {
    penalitesData = data;
    afficherPenalites(penalitesData);
    peuplerSelectPenalites(penalitesData);
  })
  .catch(error => {
    console.error("Erreur lors du chargement du fichier penalites.json :", error);
  });

// Fonction pour afficher la liste des pénalités
function afficherPenalites(liste) {
  const listeDiv = document.getElementById('liste-penalites');
  listeDiv.innerHTML = ''; // On vide avant de réafficher

  liste.forEach(item => {
    const penDiv = document.createElement('div');
    penDiv.innerHTML = `
      <strong>ID:</strong> ${item.id}<br>
      <strong>Pénalité:</strong> ${item.penalites}<br>
      <strong>Description:</strong> ${item.description}<br>
      <strong>Montant:</strong> ${item.montant} €
    `;
    penDiv.addEventListener('click', () => {
      ouvrirModale(item);
    });
    listeDiv.appendChild(penDiv);
  });
}

// Fonction pour peupler le menu déroulant avec les pénalités
function peuplerSelectPenalites(liste) {
  const select = document.getElementById('select-penalite');

  // Retirer les options existantes sauf la première
  while (select.options.length > 1) {
    select.remove(1);
  }

  liste.forEach(item => {
    const option = document.createElement('option');
    option.value = item.id;
    option.textContent = item.penalites;
    select.appendChild(option);
  });
}

// Fonction pour appliquer tous les filtres
function appliquerFiltres() {
  const query = searchInput.value.toLowerCase();
  const selectedId = selectPenalite.value;
  const max = parseInt(montantInput.value, 10);

  let filtered = penalitesData;

  if (query) {
    filtered = filtered.filter(item =>
      item.penalites.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query)
    );
  }

  if (selectedId) {
    const idNombre = parseInt(selectedId, 10);
    filtered = filtered.filter(p => p.id === idNombre);
  }

  if (!isNaN(max)) {
    filtered = filtered.filter(item => item.montant <= max);
  }

  afficherPenalites(filtered);
}

// Event listener sur le menu déroulant pour filtrer les pénalités
const selectPenalite = document.getElementById('select-penalite');
selectPenalite.addEventListener('change', appliquerFiltres);

// Event listener sur le champ de recherche
const searchInput = document.getElementById('search-input');
searchInput.addEventListener('input', appliquerFiltres);

// Event listener sur le champ de montant
const montantInput = document.getElementById('montant-input');
montantInput.addEventListener('input', appliquerFiltres);

// Références aux éléments de la modale
const modal = document.getElementById('penalite-modal');
const closeModal = document.getElementById('close-modal');
const modalId = document.getElementById('modal-id');
const modalPenalites = document.getElementById('modal-penalites');
const modalDescription = document.getElementById('modal-description');
const modalMontant = document.getElementById('modal-montant');

// Fonction pour ouvrir la modale avec les détails de la pénalité
function ouvrirModale(item) {
  modalId.textContent = item.id;
  modalPenalites.textContent = item.penalites;
  modalDescription.textContent = item.description;
  modalMontant.textContent = item.montant;
  modal.style.display = 'block';
}

// Fonction pour fermer la modale
function fermerModale() {
  modal.style.display = 'none';
}

// Event listener pour fermer la modale
closeModal.addEventListener('click', fermerModale);

// Fermer la modale en cliquant en dehors du contenu
window.addEventListener('click', (event) => {
  if (event.target == modal) {
    fermerModale();
  }
});

let selectedNameElement = null;
let isSpinning = false;
let teamCounts = [];
let rouletteType = 'normal';
let customFields = 2;
const colorPalette = ['#010101', '#C12A2F', '#F2F2F2 ', '#008000', '#FFA500', '#FFFF00', '#FFC0CB', '#A52A2A'];

document.getElementById('addNameButton').addEventListener('click', addName);
document.getElementById('spinButton').addEventListener('click', spin);
document.getElementById('saveRouletteOptionsButton').addEventListener('click', saveRouletteOptions);
document.getElementById('finalizeButton').addEventListener('click', finalizeRoulette);
document.getElementById('rouletteType').addEventListener('change', handleRouletteTypeChange);

function handleRouletteTypeChange() {
    const customOptions = document.getElementById('customOptions');
    customOptions.style.display = document.getElementById('rouletteType').value === 'custom' ? 'block' : 'none';
}

function addName() {
    const nameInput = document.getElementById('nameInput');
    const name = nameInput.value.trim();

    if (name === "") {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor ingresa un nombre.'
        });
        return;
    }

    const nameList = document.getElementById('nameList');

    const listItem = document.createElement('li');
    listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
    listItem.addEventListener('click', () => selectName(listItem));

    const nameSpan = document.createElement('span');
    nameSpan.className = 'name';
    nameSpan.textContent = name;

    const resultSpan = document.createElement('span');
    resultSpan.className = 'result';

    const removeButton = document.createElement('button');
    removeButton.className = 'btn btn-danger btn-sm';
    removeButton.textContent = 'Eliminar';
    removeButton.addEventListener('click', (event) => {
        event.stopPropagation();
        nameList.removeChild(listItem);
    });

    listItem.appendChild(nameSpan);
    listItem.appendChild(resultSpan);
    listItem.appendChild(removeButton);

    nameList.appendChild(listItem);

    nameInput.value = "";
}

function selectName(element) {
    if (selectedNameElement) {
        selectedNameElement.classList.remove('selected');
    }

    element.classList.add('selected');
    selectedNameElement = element;
}

function spin() {
    if (isSpinning) return;

    if (!selectedNameElement) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor selecciona un nombre primero.'
        });
        return;
    }

    isSpinning = true;
    const roulette = document.getElementById('roulette');
    const result = Math.random() * 360;
    const duration = Math.random() * 2 + 3; // Duración aleatoria entre 3 y 5 segundos

    roulette.style.transition = `transform ${duration}s cubic-bezier(0.25, 0.1, 0.25, 1)`;
    roulette.style.transform = `rotate(${result + 1440}deg)`; // Rotación con varias vueltas completas

    setTimeout(() => {
        const normalizedResult = (result % 360);
        const finalResult = Math.floor((normalizedResult / 360) * customFields) + 1;

        const resultSpan = selectedNameElement.querySelector('.result');
        resultSpan.textContent = finalResult;

        const rouletteResult = document.getElementById('rouletteResult');
        rouletteResult.textContent = `Resultado: ${finalResult}`;

        // Añadir el nombre al equipo correspondiente
        const name = selectedNameElement.querySelector('.name').textContent;
        addToTeam(finalResult, name);

        // Reiniciar la ruleta
        setTimeout(() => {
            roulette.style.transition = 'none';
            roulette.style.transform = 'rotate(0deg)';
        }, 500);

        isSpinning = false;
    }, duration * 1000);
}

function addToTeam(teamNumber, name) {
    const teamListId = `team${teamNumber}List`;
    const teamCountId = `team${teamNumber}Count`;
    const teamList = document.getElementById(teamListId);
    const teamCount = document.getElementById(teamCountId);

    const listItem = document.createElement('li');
    listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
    listItem.textContent = name;

    const removeButton = document.createElement('button');
    removeButton.className = 'btn btn-danger btn-sm';
    removeButton.textContent = 'Eliminar';
    removeButton.addEventListener('click', (event) => {
        event.stopPropagation();
        teamList.removeChild(listItem);
        updateTeamCount(teamNumber, -1);
    });

    listItem.appendChild(removeButton);
    teamList.appendChild(listItem);

    updateTeamCount(teamNumber, 1);
}

function updateTeamCount(teamNumber, change) {
    teamCounts[teamNumber - 1] += change;
    document.getElementById(`team${teamNumber}Count`).textContent = `Cantidad de personas: ${teamCounts[teamNumber - 1]}`;
}

function balanceTeams() {
    const maxDifference = 1;
    let minTeam = 0;
    let maxTeam = 0;

    for (let i = 0; i < teamCounts.length; i++) {
        if (teamCounts[i] < teamCounts[minTeam]) minTeam = i;
        if (teamCounts[i] > teamCounts[maxTeam]) maxTeam = i;
    }

    if (teamCounts[maxTeam] - teamCounts[minTeam] > maxDifference) {
        const teamFromList = document.getElementById(`team${maxTeam + 1}List`);
        const listItem = teamFromList.querySelector('li');
        if (listItem) {
            const nameToMove = listItem.textContent.replace('Eliminar', '').trim();
            teamFromList.removeChild(listItem);
            updateTeamCount(maxTeam + 1, -1);
            addToTeam(minTeam + 1, nameToMove);
        }
    }
}

function saveRouletteOptions() {
    rouletteType = document.getElementById('rouletteType').value;
    if (rouletteType === 'custom') {
        customFields = parseInt(document.getElementById('numberOfTeams').value);
        teamCounts = new Array(customFields).fill(0);
        generateCustomRoulette();
        generateColorSelectors();
        generateTeamContainers();
    }
    $('#rouletteOptionsModal').modal('hide');
}

function generateColorSelectors() {
    const teamColorsDiv = document.getElementById('teamColors');
    teamColorsDiv.innerHTML = '';
    for (let i = 0; i < customFields; i++) {
        const colorPicker = document.createElement('input');
        colorPicker.type = 'color';
        colorPicker.className = 'color-picker';
        colorPicker.value = colorPalette[i % colorPalette.length];
        colorPicker.id = `colorPicker${i+1}`;
        teamColorsDiv.appendChild(colorPicker);
        teamColorsDiv.appendChild(document.createTextNode(` Equipo ${i + 1}`));
    }
}

function generateCustomRoulette() {
    const roulette = document.getElementById('roulette');
    roulette.innerHTML = '';
    const anglePerField = 360 / customFields;

    for (let i = 0; i < customFields; i++) {
        const field = document.createElement('div');
        field.className = 'segment';
        const colorPicker = document.getElementById(`colorPicker${i+1}`);
        field.style.backgroundColor = colorPicker ? colorPicker.value : colorPalette[i % colorPalette.length];
        field.style.transform = `rotate(${i * anglePerField}deg)`;
        roulette.appendChild(field);

        const numberSpan = document.createElement('span');
        numberSpan.className = 'number';
        numberSpan.textContent = i + 1;
        field.appendChild(numberSpan);
    }

    const colorPaletteElement = document.getElementById('colorPalette');
    colorPaletteElement.innerHTML = colorPalette.slice(0, customFields).map(color => `<span style="background-color: ${color}; padding: 5px; margin: 2px; border: 1px solid #000;">${color}</span>`).join('');
}



function generateTeamContainers() {
    const teamContainer = document.getElementById('teamContainer');
    teamContainer.innerHTML = '';

    for (let i = 0; i < customFields; i++) {
        const teamCol = document.createElement('div');
        teamCol.className = 'col-md-6';
        teamCol.innerHTML = `
            <h3>Equipo ${i + 1}</h3>
            <p id="team${i + 1}Count">Cantidad de personas: 0</p>
            <ul class="list-group" id="team${i + 1}List"></ul>
        `;
        teamContainer.appendChild(teamCol);
    }
}

function finalizeRoulette() {
    balanceTeams();
    Swal.fire({
        icon: 'success',
        title: 'Equipos Balanceados',
        text: 'La ruleta ha finalizado y los equipos han sido balanceados.'
    });
}

// Mostrar modal al cargar la página
$(document).ready(function () {
    $('#rouletteOptionsModal').modal('show');
});

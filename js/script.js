let selectedNameElement = null;
let isSpinning = false;
let team1Count = 0;
let team2Count = 0;

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
    listItem.onclick = () => selectName(listItem);

    const nameSpan = document.createElement('span');
    nameSpan.className = 'name';
    nameSpan.textContent = name;

    const resultSpan = document.createElement('span');
    resultSpan.className = 'result';

    const removeButton = document.createElement('button');
    removeButton.className = 'btn btn-danger btn-sm';
    removeButton.textContent = 'Eliminar';
    removeButton.onclick = (event) => {
        event.stopPropagation();
        nameList.removeChild(listItem);
    };

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
        const finalResult = normalizedResult > 180 ? 2 : 1;

        const resultSpan = selectedNameElement.querySelector('.result');
        resultSpan.textContent = finalResult;

        const rouletteResult = document.getElementById('rouletteResult');
        rouletteResult.textContent = `Resultado: ${finalResult}`;

        // Añadir el nombre al equipo correspondiente
        const name = selectedNameElement.querySelector('.name').textContent;
        if (finalResult === 1) {
            addToTeam('team1List', 'team1Count', name);
        } else {
            addToTeam('team2List', 'team2Count', name);
        }

        // Reiniciar la ruleta
        setTimeout(() => {
            roulette.style.transition = 'none';
            roulette.style.transform = 'rotate(0deg)';
        }, 500);

        isSpinning = false;
    }, duration * 1000);
}

function addToTeam(teamListId, teamCountId, name) {
    const teamList = document.getElementById(teamListId);
    const teamCount = document.getElementById(teamCountId);

    const listItem = document.createElement('li');
    listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
    listItem.textContent = name;

    const removeButton = document.createElement('button');
    removeButton.className = 'btn btn-danger btn-sm';
    removeButton.textContent = 'Eliminar';
    removeButton.onclick = (event) => {
        event.stopPropagation();
        teamList.removeChild(listItem);
        updateTeamCount(teamListId, teamCountId, -1);
    };

    listItem.appendChild(removeButton);
    teamList.appendChild(listItem);

    updateTeamCount(teamListId, teamCountId, 1);
}

function updateTeamCount(teamListId, teamCountId, change) {
    if (teamListId === 'team1List') {
        team1Count += change;
        document.getElementById(teamCountId).textContent = `Cantidad de personas: ${team1Count}`;
    } else {
        team2Count += change;
        document.getElementById(teamCountId).textContent = `Cantidad de personas: ${team2Count}`;
    }
}

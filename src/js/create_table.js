export function createTable(title, data, only_exercise, index) {
    
    const table = document.createElement("table");
    const header = document.createElement("tr");
    const nameHeaderCell = document.createElement("th");
    const setsHeaderCell = document.createElement("th");
    const repsHeaderCell = document.createElement("th");
    const weightHeaderCell = document.createElement("th");
    const totalWeightHeaderCell = document.createElement("th");
    const muscleHeaderCell = document.createElement("th");
    nameHeaderCell.appendChild(document.createTextNode("Übng"));
    setsHeaderCell.appendChild(document.createTextNode("Sät"));
    repsHeaderCell.appendChild(document.createTextNode("Wdh"));
    weightHeaderCell.appendChild(document.createTextNode("Gew"));
    totalWeightHeaderCell.appendChild(document.createTextNode("Sum"));
    muscleHeaderCell.appendChild(document.createTextNode("Mskl"));
    header.appendChild(nameHeaderCell);
    header.appendChild(setsHeaderCell);
    header.appendChild(repsHeaderCell);
    header.appendChild(weightHeaderCell);
    header.appendChild(totalWeightHeaderCell);
    header.appendChild(muscleHeaderCell);
    table.appendChild(header);

    for (let i = 0; i < data.length; i++) {
        const row = document.createElement("tr");
        const nameCell = document.createElement("td");
        const setsCell = document.createElement("td");
        const repsCell = document.createElement("td");
        const weightCell = document.createElement("td");
        const totalWeightCell = document.createElement("td");
        const muscleCell = document.createElement("td");
        const totalWeight = data[i].weight * data[i].repeats * data[i].solved_sets;

        nameCell.appendChild(document.createTextNode(data[i].name));
        setsCell.appendChild(document.createTextNode(data[i].solved_sets));
        repsCell.appendChild(document.createTextNode(data[i].repeats));
        weightCell.appendChild(document.createTextNode(data[i].weight));
        totalWeightCell.appendChild(document.createTextNode(totalWeight));
        muscleCell.appendChild(document.createTextNode(data[i].musclegroup));

        row.appendChild(nameCell);
        row.appendChild(setsCell);
        row.appendChild(repsCell);
        row.appendChild(weightCell);
        row.appendChild(totalWeightCell);
        row.appendChild(muscleCell);
        table.appendChild(row);
    }

    if (only_exercise) {
        const row = document.createElement("tr");
        const nameCell = document.createElement("td");
        const setsCell = document.createElement("td");
        const repsCell = document.createElement("td");
        const weightCell = document.createElement("td");
        const totalWeightCell = document.createElement("td");
        const muscleCell = document.createElement("td");
        const totalWeight = data.weight * data.repeats * data.solved_sets;

        nameCell.appendChild(document.createTextNode(data.name));
        setsCell.appendChild(document.createTextNode(data.solved_sets));
        repsCell.appendChild(document.createTextNode(data.repeats));
        weightCell.appendChild(document.createTextNode(data.weight));
        totalWeightCell.appendChild(document.createTextNode(totalWeight));
        muscleCell.appendChild(document.createTextNode(data.musclegroup));

        row.appendChild(nameCell);
        row.appendChild(setsCell);
        row.appendChild(repsCell);
        row.appendChild(weightCell);
        row.appendChild(totalWeightCell);
        row.appendChild(muscleCell);
        table.appendChild(row);
    }
    //* Create delete button
    let delete_button = document.createElement('div');
    delete_button.classList.add('delete-button');
    delete_button.innerText = 'löschen';
    delete_button.addEventListener('click', ()=> {
        const confirm = window.confirm('Soll dieses Training wirklich gelöscht werden?')
        if(confirm) {
            save_Object.trainings.splice(index, 1);
            setTimeout(() => {
                save_into_storage();
                window.location.reload();
            }, 100);
            
        }
    })
    const container = document.createElement("div");
    const heading = document.createElement("h3");
    heading.appendChild(document.createTextNode(title));
    container.appendChild(heading);
    container.appendChild(delete_button);
    container.appendChild(table);
    return container;
}
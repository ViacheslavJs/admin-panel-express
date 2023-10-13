// 'DOMContentLoaded'
document.addEventListener('DOMContentLoaded', async () => {
    
  try {
    const response = await fetch('/rest/players/data');
    const data = await response.json();
    const tableBody = document.getElementById('table-body');

    data.forEach((player, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${player.Id}</td>
        <td>${player.Name}</td>
        <td>${player.Title}</td>
        <td>${player.Race}</td>
        <td>${player.Profession}</td>
        <td>${player.Level}</td>
        <td>${player.Birthday}</td>
        <td>${player.Banned}</td>
        <td class="cell-delete">
          <button class="button-delete font-awesome-icon fas fa-trash-alt"></button>
        </td>
      `;
      tableBody.appendChild(row);
      // второй параметр в forEach - index - если нужен порядковый номер по массиву, тогда
      // <td>${player.Id}</td> заменить на <td>${index + 1}</td>
    });
        
    const deleteButtons = document.querySelectorAll('.button-delete');
    deleteButtons.forEach(button => {
      button.addEventListener('click', () => {
        deleteRow(button);
      });
    });                                           
        
  } catch (error) {
    console.error('Error fetching data:', error);
  }
      
});
// 'DOMContentLoaded'

    
// deleteRow
async function deleteRow(button) {
  const row = button.parentElement.parentElement;
  const playerName = row.querySelector('td:nth-child(2)').textContent; 
  //console.log(playerName);

  try {
    const response = await fetch(`/rest/players/${encodeURIComponent(playerName)}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      row.remove();
      location.reload();
    } else {
      console.error('Failed to delete the player.');
    }
        
  } catch (error) {
    console.error('Error deleting player:', error);
  }
      
}
// deleteRow

    
// 'addPlayerForm'
document.getElementById('addPlayerForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const newPlayer = {
    Id: document.getElementById('id').value,
    Name: document.getElementById('name').value,
    Title: document.getElementById('title').value,
    Race: document.getElementById('race').value,
    Profession: document.getElementById('profession').value,
    Level: parseInt(document.getElementById('level').value),
    Birthday: document.getElementById('birthday').value,
    Banned: document.getElementById('banned').value,
  };

  try {
    const response = await fetch('/rest/players', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPlayer),
    });

    if (response.status === 201) {
      // Успешное добавление, перезагрузить страницу или обновить данные
      location.reload();
      clearFormFields(); // Очистка полей формы
    } else {
      console.error("Failed to add player.");
    }
        
    // Очистка полей после добавления
    function clearFormFields() {
      Id: document.getElementById('id').value = '';
      document.getElementById('name').value = '';
      document.getElementById('title').value = '';
      document.getElementById('race').value = '';
      document.getElementById('profession').value = '';
      document.getElementById('level').value = '';
      document.getElementById('birthday').value = '';
      document.getElementById('banned').value = 'No'; // Сбрасываем значение до "No"
    }
            
  } catch (error) {
    console.error("Error adding player:", error);
  }
        
});
// 'addPlayerForm'
        

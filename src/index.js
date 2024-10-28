document.addEventListener('DOMContentLoaded', () => {
  const toyCollection = document.getElementById('toy-collection');
  const toyForm = document.querySelector('.add-toy-form');
  const addBtn = document.getElementById('new-toy-btn');
  let addToy = false;

  // Toggle form visibility
  addBtn.addEventListener('click', () => {
    addToy = !addToy;
    toyForm.style.display = addToy ? 'block' : 'none';
  });

  // Fetch Toys
  fetch('http://localhost:3000/toys')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(toys => {
      toys.forEach(toy => createToyCard(toy));
    })
    .catch(error => console.error("Error fetching toys:", error));

  // Create Toy Card
  function createToyCard(toy) {
    const card = document.createElement('div');
    card.className = 'card';

    card.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn" id="${toy.id}">Like ❤️</button>
    `;

    toyCollection.appendChild(card);

    const likeBtn = card.querySelector('.like-btn');
    likeBtn.addEventListener('click', () => {
      toy.likes += 1; // Increment the likes locally
      updateLikes(toy);
    });
  }

  // Update Likes
  function updateLikes(toy) {
    fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        likes: toy.likes
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(updatedToy => {
      const card = document.getElementById(updatedToy.id).parentElement;
      card.querySelector('p').textContent = `${updatedToy.likes} Likes`;
    })
    .catch(error => console.error("Error updating likes:", error));
  }

  // Add New Toy
  toyForm.addEventListener('submit', event => {
    event.preventDefault();
    const toyName = event.target.name.value;
    const toyImage = event.target.image.value;

    fetch('http://localhost:3000/toys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: toyName,
        image: toyImage,
        likes: 0
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(newToy => {
      createToyCard(newToy);
      toyForm.reset(); // Reset the form after submission
    })
    .catch(error => console.error("Error adding new toy:", error));
  });
});

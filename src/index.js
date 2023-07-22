let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});
document.addEventListener("DOMContentLoaded", () => {
  // Fetch Andy's Toys
  fetch("http://localhost:3000/toys")
    .then((response) => response.json())
    .then((data) => {
      const toyCollection = document.getElementById("toy-collection");

      // Create a card for each toy and add it to the toy-collection div
      data.forEach((toy) => {
        const card = createToyCard(toy);
        toyCollection.appendChild(card);
      });
    })
    .catch((error) => console.error("Error fetching toys:", error));
});

// Helper function to create a card for a toy
function createToyCard(toy) {
  const card = document.createElement("div");
  card.classList.add("card");

  const h2 = document.createElement("h2");
  h2.textContent = toy.name;

  const img = document.createElement("img");
  img.src = toy.image;
  img.classList.add("toy-avatar");

  const p = document.createElement("p");
  p.textContent = `${toy.likes} likes`;

  const likeBtn = document.createElement("button");
  likeBtn.classList.add("like-btn");
  likeBtn.textContent = "Like";
  likeBtn.setAttribute("data-id", toy.id);
  likeBtn.addEventListener("click", handleLikeClick);

  card.appendChild(h2);
  card.appendChild(img);
  card.appendChild(p);
  card.appendChild(likeBtn);

  return card;
}
document.addEventListener("DOMContentLoaded", () => {

  const toyForm = document.querySelector(".add-toy-form");
  toyForm.addEventListener("submit", handleToyFormSubmit);
});

// Helper function to handle toy form submission
function handleToyFormSubmit(event) {
  event.preventDefault();

  const name = event.target.name.value;
  const image = event.target.image.value;
  const likes = 0;

  const newToy = {
    name: name,
    image: image,
    likes: likes,
  };

  // Send a POST request to add the new toy
  fetch("http://localhost:3000/toys", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newToy),
  })
    .then((response) => response.json())
    .then((data) => {
      const toyCollection = document.getElementById("toy-collection");
      const newCard = createToyCard(data);
      toyCollection.appendChild(newCard);
      event.target.reset();
    })
    .catch((error) => console.error("Error adding a new toy:", error));
}

// Event listener for "Like" button click
function handleLikeClick(event) {
  const toyId = event.target.getAttribute("data-id");
  const pTag = event.target.previousElementSibling;

  const currentLikes = parseInt(pTag.textContent.split(" ")[0]);
  const newLikes = currentLikes + 1;

  // Send a PATCH request to update the toy's likes
  fetch(`http://localhost:3000/toys/${toyId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      likes: newLikes,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      pTag.textContent = `${data.likes} likes`;
    })
    .catch((error) => console.error("Error updating toy likes:", error));
}
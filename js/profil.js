const getMyProfile = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:3000/getMyProfile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    // Mettre à jour les éléments dans le DOM avec les données récupérées
    let pseudo = document.getElementById("pseudo");
    pseudo.innerHTML = data.user.name;

    let email = document.getElementById("email");
    email.innerHTML = data.user.email;

    // Récupérer les id des cartes de l'utilisateur depuis la base de données
    const cardsIds = data.cards.map((card) => card.cardId);
    // console.log("Cartes de l'utilisateur depuis la base de données:", cardsIds);

    // Récupérer toutes les cartes depuis l'API
    const responseApi = await fetch("https://hp-api.lainocs.fr/characters");
    const allCards = await responseApi.json();
    // console.log("Cartes de l'API:", allCards);

    // Filtrer les cartes de l'utilisateur parmi toutes les cartes récupérées depuis l'API
    const userCards = allCards.filter((card) => cardsIds.includes(card.id));
    // console.log("Carte de l'user après filtre de l'api : ", userCards);

    // Créer une liste ul pour les cartes de l'utilisateur
    let cardList = document.createElement("ul");
    cardList.classList.add("card-list");

    // Pour chaque carte de l'utilisateur depuis l'API, créer un élément li et l'ajouter à la liste ul
    userCards.forEach((card) => {
      const listItem = document.createElement("li");
      listItem.classList.add("hp-card");
      listItem.setAttribute("alt", card.slug);
      listItem.setAttribute("data-maison", card.house);

      const link = document.createElement("a");
      link.href = `card.html?slug=${card.slug}`;

      const h2 = document.createElement("h2");
      h2.textContent = card.name;

      const img = document.createElement("img");
      img.src = card.image;
      img.alt = card.name;

      link.appendChild(h2);
      link.appendChild(img);
      listItem.appendChild(link);

      cardList.appendChild(listItem);
    });

    // Sélectionner l'élément où afficher les cartes et ajouter la liste ul
    let cardsContainer = document.getElementById("list-card");
    const title = document.createElement("h2");
    cardsContainer.innerHTML = ""; // Vider le contenu actuel
    title.innerHTML = "My Cards";
    cardsContainer.appendChild(title);
    cardsContainer.appendChild(cardList);

    // Retourner l'ID de l'utilisateur
    return data.user.id;
  } catch (error) {
    console.log("Une erreur s'est produite:", error);
  }
};

getMyProfile();

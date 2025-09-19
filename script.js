let total = 0;

// Load All Trees
function loadAllTrees() {
  const spinner = document.getElementById("spinner");
  const container = document.getElementById("treesSection");

  spinner.classList.remove("hidden");
  container.classList.add("hidden");

  fetch("https://openapi.programming-hero.com/api/plants")
    .then((res) => res.json())
    // displayTrees()
    .then((data) => displayTrees(data.plants))
    .finally(() => {
      spinner.classList.add("hidden");
      container.classList.remove("hidden");
    });
}

// Display Trees / Middle Section
function displayTrees(plants) {
  const plantsContainer = document.getElementById("plants-container");
  plantsContainer.innerHTML = "";
  plants.forEach((plant) => {
    console.log(plant);
    const plantDiv = document.createElement("div");
    plantDiv.innerHTML = `
        <div onclick="loadModal(${plant.id})" class="bg-white p-3 rounded-xl flex flex-col gap-2 h-full cursor-pointer">
              <img
              class="w-full h-48 object-cover rounded-lg" src="${plant.image}" alt="">
              <h1 class="font-semibold">${plant.name}</h1>
              <p class="font-light plant-description">${plant.description}</p>
              <div class="flex justify-between mt-auto">
                <button class="btn bg-[#DCFCE7] text-[#15803d] rounded-full">${plant.category}</button>
                <p>$${plant.price}</p>
              </div>
              <button onclick="addToCart('${plant.name}', ${plant.price})" class="btn bg-[#15803d] text-white w-full rounded-full">Add to Cart</button>
            </div>`;
    plantsContainer.appendChild(plantDiv);
  });
}

// Load Categories
function loadCategories() {
  fetch("https://openapi.programming-hero.com/api/categories")
    .then((res) => res.json())
    // displayCategories()
    .then((data) => displayCategories(data.categories));
}

// Display Categories / Left Section
function displayCategories(categories) {
  const categoriesUL = document.getElementById("categories-ul");
  categoriesUL.innerHTML = "";

  // add (All Trees) category first
  const allLi = document.createElement("li");
  allLi.innerHTML = `<a class="category-link active-category" onclick="loadTreesByAllCategory(this)">
                      All Trees
                    </a>`;
  categoriesUL.appendChild(allLi);

  // loop through API categories
  categories.forEach((category) => {
    const li = document.createElement("li");
    li.innerHTML = `<a class="category-link" onclick="toggleCategory(this, ${category.id})">
                      ${category.category_name}
                    </a>`;
    categoriesUL.appendChild(li);
  });
}

// Load Trees by All Trees Category Btn
function loadTreesByAllCategory(element) {
  const links = document.querySelectorAll(".category-link");

  // Remove active from all
  links.forEach((link) => link.classList.remove("active-category"));

  // Add active to clicked
  element.classList.add("active-category");

  // loadAllTrees()
  loadAllTrees();
}

// Load Trees by Category Btn
function loadTreesByCategory(id) {
  const spinner = document.getElementById("spinner");
  const container = document.getElementById("treesSection");

  spinner.classList.remove("hidden");
  container.classList.add("hidden");

  fetch(`https://openapi.programming-hero.com/api/category/${id}`)
    .then((res) => res.json())
    .then((data) => displayTrees(data.plants))
    .finally(() => {
      spinner.classList.add("hidden");
      container.classList.remove("hidden");
    }); // hide spinner
}

// Toggle Active State
function toggleCategory(element, id) {
  // Remove active from all
  const links = document.querySelectorAll(".category-link");
  links.forEach((link) => link.classList.remove("active-category"));

  // Add active to clicked
  element.classList.add("active-category");

  // Load trees by category
  loadTreesByCategory(id);
}

// MODAL
// Load Modal
function loadModal(id) {
  fetch(`https://openapi.programming-hero.com/api/plant/${id}`)
    .then((res) => res.json())
    .then((data) => displayModal(data.plants));
}

// Display Modal
function displayModal(plant) {
  const modalContainer = document.getElementById("modal-Container");
  modalContainer.innerHTML = `
            <img class="h-1/2 w-1/2" src="${plant.image}" alt="" />
            <h1 class="font-semibold text-green-700" >${plant.name}</h1>
            <h1 class="font-semibold text-red-400">$${plant.price}</h1>
            <p class="font-light" >${plant.description}</p>
            <h1 class="btn bg-[#DCFCE7] text-[#15803d] rounded-full" >${plant.category}</h1>
  `;
  document.getElementById("my_modal").showModal();
}

// CART
// Add to Cart Btn
function addToCart(name, price) {
  // console.log(name, price);
  const cartContainer = document.getElementById("cart-Container");
  // create new div
  const div = document.createElement("div");
  div.classList.add(
    "flex",
    "justify-between",
    "items-center",
    "bg-[#ECFDF5]",
    "rounded-lg",
    "p-2"
  );
  div.innerHTML = `
              <div>
                <h1>${name}</h1>
                <h1>$${price}</h1>
              </div>
              <div>
              <i onclick="removeFromCart(this, ${price})" class="fa-solid fa-xmark cursor-pointer"></i>
              </div>
  `;

  cartContainer.appendChild(div);

  total += Number(price);
  document.getElementById("cart-Total").innerText = total.toFixed(2);
}

// Remove from Cart
function removeFromCart(elem, price) {
  // remove the parent div
  elem.closest("div.flex").remove();

  total -= Number(price);
  document.getElementById("cart-Total").innerText = total.toFixed(2);
}

// Clear Cart
function clearCart() {
  document.getElementById("cart-Container").innerHTML = "";
  total = 0;
  document.getElementById("cart-Total").innerText = total.toFixed(2);
}

// ...... Load At Start
loadCategories();
loadAllTrees();

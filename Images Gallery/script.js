const cards = [...document.querySelectorAll(".gallery-card")];
const filterButtons = [...document.querySelectorAll(".filter-btn")];
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxCategory = document.getElementById("lightboxCategory");
const lightboxCounter = document.getElementById("lightboxCounter");
const closeBtn = document.getElementById("closeBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const imageCount = document.querySelector(".image-count");
let visibleCards = [];
let currentIndex = 0;
let previousFocus = null;
// Return the cards that match the selected category.
function updateVisibleCards() {
  visibleCards = cards.filter(card => !card.hidden);
  imageCount.textContent =
    `${visibleCards.length} ${visibleCards.length === 1 ? "image" : "images"} found`;
}
// Category filters
filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    const selectedCategory = button.dataset.filter;
    filterButtons.forEach(item => {
      const isActive = item === button;
      item.classList.toggle("active", isActive);
      item.setAttribute("aria-pressed", isActive);
    });
    cards.forEach(card => {
      const matches =
        selectedCategory === "all" ||
        card.dataset.category === selectedCategory;
      card.hidden = !matches;
    });
    updateVisibleCards();
  });
  button.setAttribute(
    "aria-pressed",
    button.classList.contains("active")
  );
});
// Open a selected image in the lightbox.
function openLightbox(card) {
  updateVisibleCards();
  currentIndex = visibleCards.indexOf(card);
  if (currentIndex < 0) return;
  previousFocus = document.activeElement;
  showImage(currentIndex);
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  closeBtn.focus();
}
// Display an image and its information.
function showImage(index) {
  currentIndex =
    (index + visibleCards.length) % visibleCards.length;
  const card = visibleCards[currentIndex];
  const image = card.querySelector("img");
  lightboxImage.src = image.src;
  lightboxImage.alt = image.alt;
  lightboxTitle.textContent =
    card.querySelector("h3").textContent;
  lightboxCategory.textContent =
    card.dataset.category;
  lightboxCounter.textContent =
    `Image ${currentIndex + 1} of ${visibleCards.length}`;
  prevBtn.disabled = visibleCards.length < 2;
  nextBtn.disabled = visibleCards.length < 2;
}
// Next and previous navigation.
function showNext() {
  if (visibleCards.length > 1) {
    showImage(currentIndex + 1);
  }
}
function showPrevious() {
  if (visibleCards.length > 1) {
    showImage(currentIndex - 1);
  }
}
nextBtn.addEventListener("click", showNext);
prevBtn.addEventListener("click", showPrevious);
// Open an image by clicking its card or view button.
cards.forEach(card => {
  card.addEventListener("click", () => {
    openLightbox(card);
  });
});
// Close the lightbox.
function closeLightbox() {
  if (!lightbox.classList.contains("open")) return;
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  // Return keyboard focus to the previous element.
  if (previousFocus && previousFocus.isConnected) {
    previousFocus.focus();
  }
}
closeBtn.addEventListener("click", closeLightbox);
// Close when the dark background is clicked.
lightbox.addEventListener("click", event => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});
// Keyboard navigation.
document.addEventListener("keydown", event => {
  if (!lightbox.classList.contains("open")) return;
  if (event.key === "Escape") {
    closeLightbox();
  } else if (event.key === "ArrowRight") {
    showNext();
  } else if (event.key === "ArrowLeft") {
    showPrevious();
  }
});
// Initialize the gallery.
updateVisibleCards();
import galleryItems from './gallery-items.js';

const galleryContainer = document.querySelector('.js-gallery');
const lightboxRef = document.querySelector('.js-lightbox');
const lightboxImageRef = document.querySelector('.lightbox__image');
const closeModalBtnRef = document.querySelector(
  'button[data-action="close-lightbox"]',
);
const overlayRef = document.querySelector('.lightbox__overlay');

// 1. Создание и рендер разметки по массиву данных и предоставленному шаблону.
const galleryItemMarkup = createGalleryItemMarkup(galleryItems);

function createGalleryItemMarkup(galleryItems) {
  return galleryItems
    .map(({ preview, original, description }) => {
      return `
   <li class="gallery__item">
  <a
    class="gallery__link"
    href="${original}"
  >
    <img
      class="gallery__image"
      src="${preview}"
      data-source="${original}"
      alt="${description}"
    />
  </a>
</li >
`;
    })
    .join('');
}

galleryContainer.innerHTML = galleryItemMarkup;
// galleryContainer.insertAdjacentHTML('afterbegin', galleryItemMarkup);

// 2. Реализация делегирования на галерее ul.js-gallery и получение url большого изображения.
galleryContainer.addEventListener('click', onGalleryContainerClick);

function onGalleryContainerClick(e) {
  e.preventDefault();

  if (!e.target.nodeName === 'IMG') {
    return;
  }

  getBigImageSrc(e);

  openModal();
}

// 3. Открытие модального окна по клику на элементе галереи.
function openModal() {
  lightboxRef.classList.add('is-open');

  window.addEventListener('keydown', onPressESC);
  window.addEventListener('keydown', onPressArrowLeft);
  window.addEventListener('keydown', onPressArrowRight);
}

// 4. Подмена значения атрибута src элемента img.lightbox__image.
function getBigImageSrc(e) {
  lightboxImageRef.src = e.target.dataset.source;
  lightboxImageRef.alt = e.target.alt;
  lightboxImageRef.setAttribute('data-index', `${e.target.dataset.index}`);
}

// 5. Закрытие модального окна по клику на кнопку button[data-action="close-lightbox"].
closeModalBtnRef.addEventListener('click', closeModalBtn);

function closeModalBtn() {
  lightboxRef.classList.remove('is-open');

  window.removeEventListener('keydown', onPressESC);
  window.removeEventListener('keydown', onPressArrowLeft);
  window.removeEventListener('keydown', onPressArrowRight);

  cleanSrc();
}
// 6. Очистка значения атрибута src элемента img.lightbox__image.
function cleanSrc() {
  lightboxImageRef.src = '';
  lightboxImageRef.alt = '';
  lightboxImageRef.removeAttribute('data-index');
}

// Дополнительно

//Закрытие модального окна по клику на div.lightbox__overlay.
overlayRef.addEventListener('click', e => {
  if (e.target === e.currentTarget) {
    closeModalBtn();
  }
});

// Закрытие модального окна по нажатию клавиши ESC.
function onPressESC(e) {
  if (e.key === 'Escape') {
    closeModalBtn();
  }
}

// Пролистывание изображений галереи в открытом модальном окне клавишами "влево" и "вправо".
let index = 0;

function onPressArrowLeft(e) {
  if (e.key === 'ArrowLeft' && index > 0) {
    lightboxImageRef.src = galleryItems[(index -= 1)].original;
  }
}
function onPressArrowRight(e) {
  if (e.key === 'ArrowRight' && index < galleryItems.length - 1) {
    lightboxImageRef.src = galleryItems[(index += 1)].original;
  }
}

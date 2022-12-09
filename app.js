import { createNewsFormContent } from "./form/form.js";
import { fetchNews } from "./functions.js";

const newsContent = document.querySelector(".News__content");
const formModal = document.querySelector(".Form");
const addNewsModal = document.querySelector(".News__header_btn");
const sliderContent = document.querySelector(".Slider__content");
const sliderBtns = document.querySelectorAll(".Slider__Btn");
const paginationBtns = document.querySelectorAll(".Pagination__btn");
const paginationCount = document.querySelector(".Pagination__count");

const init = async () => {
  const result = await fetchNews();

  let currentPage = 1;
  const maxNewsLength = result.length;
  const limit = 10;
  const numOfPages = Math.ceil(maxNewsLength / limit);

  // Form modal
  addNewsModal.addEventListener("click", () => {
    createNewsFormContent();
    formModal.style.display = "grid";
  });

  // Image slider
  let sliderIndex = 0;
  const maxSliderImg = 15;
  const randomNum = Math.floor(Math.random() * 10);
  const totalSlideImg = result.slice(randomNum, randomNum + maxSliderImg);

  const createSliderItem = (avatar) =>
    `<img class="Slider__content_img" src=${avatar} alt="" />`;

  const getSliderContent = (index) => {
    let slides = totalSlideImg.slice(index, index + 3);
    if (slides.length < 3) {
      slides = slides.concat(totalSlideImg.slice(0, 3 - slides.length));
    }

    const sliderItem = slides
      .map((item) => createSliderItem(item.avatar))
      .join("");
    sliderContent.innerHTML = sliderItem;
  };

  getSliderContent(sliderIndex);

  sliderBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const activeBtn = e.currentTarget.classList;
      if (activeBtn.contains("prev")) {
        sliderIndex--;
        if (sliderIndex < 0) sliderIndex = totalSlideImg.length - 1;
      }
      if (activeBtn.contains("next")) {
        sliderIndex++;
        if (sliderIndex === totalSlideImg.length - 1) sliderIndex = 0;
      }
      getSliderContent(sliderIndex);
    });
  });

  // News items
  const createNewsItem = ({ author, avatar, title, id }) => `
    <a href='singleNews/singleNews.html?id=${id}' class="News__content_item">
        <img class="News__content_item_img" src=${avatar} alt="news title" />
        <div class="News__content_item_desc">
            <h3 class="News__content_item_desc_author">
            ${author}
            </h3>
            <p class="News__content_item_desc_title">
            ${title}
            </p>
        </div>
    </a>
`;

  const getNewsItem = async (page) => {
    newsContent.innerHTML = `<h4 class='loading'>Loading...</h4>`;
    try {
      const news = await fetchNews({
        page: page,
        limit: limit,
      });
      const newsItem = news.map((item) => createNewsItem(item)).join("");
      newsContent.innerHTML = newsItem;
    } catch (err) {
      newsContent.innerHTML = `<h4 class='loading'>something went wrong try again later.</h4>`;
    }
  };

  getNewsItem(currentPage);

  // Pagination
  const pagination = (page) => {
    const paginationItem = `
    <span class='Pagination__count_item'>${page}</span>
    <span>of</span>
    <span class='Pagination__count_item'>${numOfPages}</span>
  `;

    paginationCount.innerHTML = paginationItem;
  };

  pagination(currentPage);

  paginationBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const activeBtn = e.currentTarget.classList;
      if (activeBtn.contains("prev")) {
        currentPage--;
        if (currentPage < 1) currentPage = numOfPages;
      }
      if (activeBtn.contains("next")) {
        currentPage++;
        if (currentPage > numOfPages) currentPage = 1;
      }
      getNewsItem(currentPage);
      pagination(currentPage);
    });
  });
};

init();

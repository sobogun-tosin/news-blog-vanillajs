import { postNews, updateNews } from "../functions.js";
import { returnFileSize, showErrorMessage } from "../utils/genericUtils.js";
import { kilobyte } from "../data/constant.js";

const formModal = document.querySelector(".Form");

const handleClose = () => {
  formModal.style.display = "none";
};

const isRequired = (value) => (value === "" ? false : true);
const isImageSizeValid = (size) => (size > kilobyte * 50 ? false : true);

const newsFormContent = (type, data) => `
    <form class="Form__content">
        <button class="Form__content_close">
            <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            class="bi bi-x-circle Form__content_svg"
            viewBox="0 0 16 16"
             >
                <path
                d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"
                />
                <path
                d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
                />
            </svg>
        </button>
        <header class="Form__content_header">
            <h3 class="Form__content_header_title"> ${
              type === "update" ? "Update" : "Add"
            }  your story</h3>
            <p class="Form__content_header_text">Join our team</p>
        </header>
        <div class="Form__content_row">
            <label class="Form__content_row_label" for="author">Author</label>
            <input
            class="Form__content_row_input"
            type="text"
            name="author"
            id="author"
            value="${type === "update" && data ? data.author : ""}"
            />
            <small></small>
        </div>
        <div class="Form__content_row">
            <label class="Form__content_row_label" for="title">Title</label>
            <input
            class="Form__content_row_input"
            type="text"
            name="title"
            id="title"
            value="${type === "update" && data ? data.title : ""}"
            />
            <small></small>
        </div>
        <div class="Form__content_row">
            <label class="Form__content_row_label" for="url">Url</label>
            <input
            class="Form__content_row_input"
            type="text"
            name="url"
            id="url"
            value="${type === "update" && data ? data.url : ""}"
            />
            <small></small>
        </div>
        <div class="Form__content_row">
            <label class="Form__content_row_label" for="avatar">Avatar</label>
            <div class="Form__content_row_img">
            <input
            class="Form__content_row_img_input"
            type="file"
            name="avatar"
            id="avatar"
            accept="image/jpg, image/png, image/webp, image/jpeg"
            />
            <span class="Form__content_row_img_span"></span>
            <img id="previewImg" src="../previewImg.png" width="50px" height="50px"/>
            <small></small>
            </div>
        </div>
        <button class="Form__content_btn" type="submit">${
          type === "update" ? "Update" : "Submit"
        }</button>
    </form>
`;

export const createNewsFormContent = (type, data) => {
  formModal.innerHTML = newsFormContent(type, data);

  const author = document.getElementById("author");
  const title = document.getElementById("title");
  const url = document.getElementById("url");
  const avatar = document.getElementById("avatar");
  const closeBtn = document.querySelector(".Form__content_close");
  const submit = document.querySelector(".Form__content");
  const imgSize = document.querySelector(".Form__content_row_img_span");
  const previewImg = document.getElementById("previewImg");

  let imageUrl = "";

  closeBtn.addEventListener("click", handleClose);

  author.addEventListener("change", () => {
    if (!isRequired(author.value)) {
      showErrorMessage(author, `Please enter author's name`);
    } else showErrorMessage(author, ``);
  });
  title.addEventListener("change", () => {
    if (!isRequired(title.value)) {
      showErrorMessage(title, `Please enter a title`);
    } else showErrorMessage(title, ``);
  });
  url.addEventListener("change", () => {
    if (!isRequired(url.value)) {
      showErrorMessage(url, `Please enter a valid url`);
    } else showErrorMessage(url, ``);
  });

  avatar.addEventListener("change", () => {
    const [file] = avatar.files;
    if (!isImageSizeValid(file.size)) {
      showErrorMessage(avatar, "File too big");
    }
    if (file) {
      previewImg.src = URL.createObjectURL(file);
      imgSize.textContent = `Size: ${returnFileSize(file.size)}`;
    }
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      imageUrl = reader.result;
    });
    reader.readAsDataURL(file);
  });

  submit.addEventListener("submit", async (e) => {
    e.preventDefault();

    const [file] = avatar.files;

    const formData = {
      author: author.value,
      url: url.value,
      title: title.value,
      avatar: imageUrl,
    };

    if (
      isRequired(author.value) &&
      isRequired(url.value) &&
      isRequired(title.value) &&
      isRequired(file.name) &&
      isImageSizeValid(file.size)
    ) {
      if (type === "update") {
        const res = await updateNews(data.id, formData);
        if (res) {
          handleClose();
          alert("News updated successfully");
        } else alert("something went wrong");
      } else {
        const res = await postNews(formData);
        if (res) {
          handleClose();
          alert("News added successfully");
        } else alert("Something went wrong");
      }
    }
  });
};

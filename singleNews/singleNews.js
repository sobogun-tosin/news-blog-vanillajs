import { kilobyte } from "../data/constant.js";
import { createNewsFormContent } from "../form/form.js";
import {
  deleteComments,
  deleteSingleNews,
  fetchComments,
  fetchSingleNews,
  postComments,
  updateComments,
} from "../functions.js";
import { returnFileSize, showErrorMessage } from "../utils/genericUtils.js";

const singleNewsContent = document.querySelector(
  ".SingleNews__container_content"
);
const formModal = document.querySelector(".Form");
const commentContent = document.querySelector(
  ".SingleNews__container_comment_item"
);
const commentFormContent = document.querySelector(".Comments");

const searchParams = new URLSearchParams(window.location.search);
const params = searchParams.get("id");

const isRequired = (value) => (value === "" ? false : true);
const isImageSizeValid = (size) => (size > kilobyte * 50 ? false : true);

const init = async () => {
  const singleNews = await fetchSingleNews(params);

  const handleDelete = async () => {
    const res = await deleteSingleNews(params);
    if (res) {
      alert("News deleted successfully");
      window.location("../index.html");
    }
  };

  const handleUpdate = () => {
    createNewsFormContent("update", singleNews);
    formModal.style.display = "grid";
  };

  // Single news content
  const createSingleNewsContent = ({ author, title, avatar }) => `
    <img
        class="SingleNews__container_content_img"
        src="${avatar}"
        alt="${title}"
    />
    <div class="SingleNews__container_content_desc">
        <h2 class="SingleNews__container_content_desc_title">${title}</h2>
        <h4 class="SingleNews__container_content_desc_author">${author}</h4>
        <div class="SingleNews__container_content_desc_post">
            <button
                class="SingleNews__container_content_desc_post_btn delete"
            >
                delete post
            </button>
            <button
                class="SingleNews__container_content_desc_post_btn update"
            >
                update post
            </button>
        </div>
    </div>
`;

  const getSingleNewsContent = () => {
    singleNewsContent.innerHTML = `<h4 class='loading'>Loading...</h4>`;
    try {
      singleNewsContent.innerHTML = createSingleNewsContent(singleNews);
      const deleteBtn = document.querySelector(".delete");
      deleteBtn.addEventListener("click", handleDelete);
      const updateBtn = document.querySelector(".update");
      updateBtn.addEventListener("click", handleUpdate);
    } catch (err) {
      singleNewsContent.innerHTML = `<h4 class='loading'>Something went wrong.</h4>`;
      console.error(err);
    }
  };

  getSingleNewsContent();

  // Comments content
  const createCommentContent = ({ name, avatar, comment, id }) => `
    <img
        src="${avatar}"
        alt="${name}"
        class="SingleNews__container_comment_item_img"
    />
    <h4 class="SingleNews__container_comment_item_name">${name}</h4>
    <p class="SingleNews__container_comment_item_text">${comment}</p>
    <div class="SingleNews__container_comment_item_btns">
        <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        class="bi bi-trash3-fill SingleNews__container_comment_item_btns_delete"
        viewBox="0 0 16 16"
        data-id='${id}'
        >
        <path
            d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z"
        />
        </svg>
        <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        class="bi bi-pencil-fill SingleNews__container_comment_item_btns_edit"
        viewBox="0 0 16 16"
        data-id='${id}'
        >
        <path
            d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"
        />
        </svg>
    </div>
  `;

  const getCommentContent = async () => {
    commentContent.innerHTML = `<h4 class='loading'>Loading...</h4>`;
    try {
      const comments = await fetchComments(params);
      const commentItems = comments
        .map((item) => createCommentContent(item))
        .join("");
      commentContent.innerHTML = commentItems;

      const deleteBtn = document.querySelector(
        ".SingleNews__container_comment_item_btns_delete"
      );
      const editBtn = document.querySelector(
        ".SingleNews__container_comment_item_btns_edit"
      );

      if (comments.length != 0) {
        deleteBtn.addEventListener("click", async (e) => {
          const id = e.currentTarget.dataset.id;
          const res = await deleteComments(params, id);
          if (res) {
            window.location("../index.html");
            alert("News deleted successfully");
          } else {
            alert("Something went wrong");
          }
        });

        editBtn.addEventListener("click", (e) => {
          const id = e.currentTarget.dataset.id;
          getCommentFormContent(
            "edit",
            comments.find((item) => item.id === id)
          );
        });
      }
    } catch (err) {
      commentContent.innerHTML = `<h4 class='loading'>Be the first to comment.</h4>`;
      console.error(err);
    }
  };

  getCommentContent();

  const createCommentFormContent = (type, data) => `
  <form class="SingleNews__container_form">
    <h4 class="SingleNews__container_form">
    ${type === "edit" ? "Edit" : "Add"} comments</h4>
    <div class="SingleNews__container_form_row">
      <label class="SingleNews__container_form_row_label" for="name"
        >Name</label
      >
      <input
        class="SingleNews__container_form_row_input"
        type="text"
        name="name"
        id="name"
        value="${type === "edit" && data ? data.name : ""}"
      />
      <small></small>
    </div>
    <div class="SingleNews__container_form_row">
      <label class="SingleNews__container_form_row_label" for="avatar"
        >Avatar</label
      >
       <div class="SingleNews__container_form_row_img">
        <input
        class="SingleNews__container_form_row_img_input"
        type="file"
        name="avatar"
        id="avatar"
        accept="image/jpg, image/png, image/webp, image/jpeg"
        />
        <span class="SingleNews__container_form_row_img_span"></span>
        <img id="previewImg" src="../previewImg.png" width="50px" height="50px"/>
        <small></small>
        </div>
    </div>
    <div class="SingleNews__container_form_row">
      <label class="SingleNews__container_form_row_label" for="comment"
        >Comment</label
      >
      <textarea
        name="comment"
        id="comment"
        cols="30"
        rows="5"
        value="${type === "edit" && data ? data.comment : ""}"
        class="SingleNews__container_form_row_input textarea"
      ></textarea>
    </div>
    <button class="SingleNews__container_form_btn" type="submit">
      ${type === "edit" ? "Edit" : "Submit"}
    </button>
  </form>
`;

  const getCommentFormContent = (type, data) => {
    commentFormContent.innerHTML = createCommentFormContent(type, data);
    const name = document.getElementById("name");
    const avatar = document.getElementById("avatar");
    const comment = document.getElementById("comment");
    const form = document.querySelector(".SingleNews__container_form");
    const previewImg = document.getElementById("previewImg");
    const imgSize = document.querySelector(
      ".SingleNews__container_form_row_img_span"
    );

    let imageUrl = "";

    name.addEventListener("change", () => {
      if (!isRequired(name.value)) {
        showErrorMessage(name, "Please enter your name");
      } else showErrorMessage(name, "");
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

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const [file] = avatar.files;

      const formData = {
        name: name.value,
        comment: comment.value,
        newsId: params,
        avatar: imageUrl,
      };

      if (
        isRequired(name.value) &&
        isRequired(file.name) &&
        isImageSizeValid(file.size) &&
        isRequired(comment)
      ) {
        if (type === "edit") {
          const res = await updateComments(params, data.id, formData);
          if (res) {
            alert("Comment updated successfully");
          } else {
            alert("Something went wrong");
          }
        } else {
          const res = await postComments(params, formData);
          if (res) {
            alert("Comment added successfully");
          } else {
            alert("Something went wrong");
          }
        }
      }
    });
  };

  getCommentFormContent();
};

init();

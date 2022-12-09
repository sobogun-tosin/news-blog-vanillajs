import { newsUrl } from "./data/apiRoutes.js";

export const fetchNews = async (params) => {
  try {
    const searchParams = new URLSearchParams(params);
    const res = await fetch(`${newsUrl}?${searchParams}`);
    if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error.message);
  }
};

export const fetchSingleNews = async (id) => {
  try {
    const res = await fetch(`${newsUrl}/${id}`);
    if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error.message);
  }
};

export const postNews = async (values) => {
  try {
    const res = await fetch(`${newsUrl}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error.message);
  }
};

export const updateNews = async (id, values) => {
  try {
    const res = await fetch(`${newsUrl}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error.message);
  }
};

export const deleteSingleNews = async (id) => {
  try {
    const res = await fetch(`${newsUrl}/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error.message);
  }
};

export const fetchComments = async (id) => {
  try {
    const res = await fetch(`${newsUrl}/${id}/comments`, {
      method: "GET",
    });
    if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error.message);
  }
};

export const postComments = async (id, values) => {
  try {
    const res = await fetch(`${newsUrl}/${id}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error.message);
  }
};

export const updateComments = async (newsId, commentId, values) => {
  try {
    const res = await fetch(`${newsUrl}/${newsId}/comments/${commentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error.message);
  }
};

export const deleteComments = async (newsId, commentId) => {
  try {
    const res = await fetch(`${newsUrl}/${newsId}/comments/${commentId}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error.message);
  }
};

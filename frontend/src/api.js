const API = "http://localhost:8080/api";
export const get = (path) => fetch(API + path).then((r) => r.json());
export const post = (path, body) =>
  fetch(API + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body || {}),
  }).then(async (r) => {
    if (!r.ok) throw new Error((await r.text()) || "Request failed");
    const text = await r.text();
    return text ? JSON.parse(text) : {};
  });
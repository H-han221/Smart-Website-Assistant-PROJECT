import api from "./api";

export const sendQuestion = (question) => {
  return api.post("/chat", { question });
};

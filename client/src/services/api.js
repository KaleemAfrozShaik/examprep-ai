import axios from "../api/axios";
import { setLoading, setUserData } from "../redux/userSlice";

export const getCurrentUser = async (dispatch) => {
  try {
    const response = await axios.get("/api/user/currentUser");

    dispatch(setUserData(response.data.user));
  } catch (error) {
    dispatch(setUserData(null));
  } finally {
    dispatch(setLoading(false));
  }
};

export const generateNotes = async (payload) => {
  try {
    const result = await axios.post(
      "/api/notes/generate-notes",
      payload
    );
    return result.data;
  } catch (error) {
    console.error("Notes generation error:", error);
    throw error;
  }
};

export const downloadPdf = async (result) => {
  try {
    const response = await axios.post(
      "/api/pdf/generate-pdf",
      { result },
      {
        responseType: "blob",
      },
    );

    const blob = new Blob([response.data], {
      type: "application/pdf",
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "ExamPrepAI.pdf";
    link.click();

    window.URL.revokeObjectURL(url);
  } catch (error) {
    throw new Error("PDF download failed");
  }
};

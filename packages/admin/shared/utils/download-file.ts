import axios from "axios";

export const downloadFile = async (fileURL: string, fileName: string) => {
  const response = await axios.get(fileURL, {
    responseType: "arraybuffer",
  });
  const blob = new Blob([response.data], {
    type: response.headers["content-type"],
  });
  const link = document.createElement("a");
  const url = window.URL.createObjectURL(blob);
  link.href = url;
  link.target = "_self";
  if (fileName) link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export async function bloodProcessing(image: File) {
  try {
    const formData = new FormData();
    formData.append("image", image);

    const response = await fetch("/api/edgedetection", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    let contourFile = null;

    if (data.contour_image) {
      try {
        const byteCharacters = atob(data.contour_image);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset++) {
          const byteArray = byteCharacters.charCodeAt(offset);
          byteArrays.push(byteArray);
        }

        const byteArray = new Uint8Array(byteArrays);
        const blob = new Blob([byteArray], { type: "image/png" });
        contourFile = new File([blob], "contour_image.png", {
          type: "image/png",
        });
      } catch (imageError) {
        console.error("Error processing contour image:", imageError);
      }
    }

    let ellipseEquation = null;
    if (data.ellipse_equation) {
      ellipseEquation = data.ellipse_equation;
    }

    return { contourFile, ellipseEquation };
  } catch (error) {
    console.error("Error in bloodProcessing:", error);
    return { contourFile: null, ellipseEquation: null };
  }
}

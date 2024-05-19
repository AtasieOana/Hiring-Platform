import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { AppToaster } from "./AppToaster";
import { Button, FileInput, Intent } from "@blueprintjs/core";

const ImageUpload = ({ onImageUpload, initialImg }) => {
  const { t } = useTranslation();

  const [selectedImage, setSelectedImage] = useState(initialImg);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    // Check if the file is an image
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
      onImageUpload(file);
    } else {
      AppToaster.show({
        message: t("profile_img_err"),
        intent: Intent.WARNING,
      });
    }
  };

  const handleRemoveImage = () => {
    onImageUpload(null);
    setSelectedImage(null);
  };

  return (
    <div className="custom-file-container">
      <div className="custom-image-container">
        {selectedImage && (
          <div className="custom-image-wrapper">
            <img
              className="custom-image"
              src={URL.createObjectURL(selectedImage)}
              alt="Profile image"
            />
            <Button
              className="remove-image-button"
              onClick={handleRemoveImage}
              minimal
              small
              intent={Intent.DANGER}
            >
              {t("remove_img")}
            </Button>
          </div>
        )}
      </div>
      <div
        className={
          selectedImage ? "file-input-container" : "file-input-container-hole"
        }
      >
        <div className="file-input-label-title">{t("choose_img")}</div>
        <div className="file-input-label">{t("photo_format")}</div>
        <div className="file-input-content">
          <FileInput
            text={
              !selectedImage || !selectedImage.name
                ? t("choose_file")
                : selectedImage.name
            }
            buttonText={t("choose")}
            inputProps={{
              accept: ".jpg,.png",
            }}
            onInputChange={handleImageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;

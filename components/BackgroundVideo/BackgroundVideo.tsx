import React from "react";

const BackgroundVideo = () => {
  return (
    <video
      autoPlay
      muted
      loop
      width={"100%"}
      height={"100%"}
      className={`absolute top-0 left-0 object-cover h-full z-[-1] transition-all duration-500`}
    >
      <source src="/assets/BlossomBG.webm" type="video/webm" />
    </video>
  );
};

export default BackgroundVideo;

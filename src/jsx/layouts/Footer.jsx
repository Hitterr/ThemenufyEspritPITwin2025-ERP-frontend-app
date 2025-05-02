import React from "react";

const Footer = () => {
  let year = new Date().getFullYear();
  return (
    <div className="footer">
      <div className="copyright">
        <p>
          Copyright © Made With ♡ &amp; Developed by{" "}
          <a href="http://dexignzone.com/" target="_blank"  rel="noreferrer">
            TheFinals
          </a>{" "}
          {year}
        </p>
      </div>
    </div>
  );
};

export default Footer;

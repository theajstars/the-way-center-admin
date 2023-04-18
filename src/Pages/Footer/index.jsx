import { useState } from "react";

export default function Footer() {
  return (
    <div id="footer" className="flex-row footer-row">
      <a href="#footer" className="footer-link poppins px-13">
        Terms and Conditions
      </a>
      <a href="#footer" className="footer-link poppins px-13">
        Privacy Policy
      </a>
      <a href="#footer" className="footer-link poppins px-13">
        Documentation
      </a>
    </div>
  );
}

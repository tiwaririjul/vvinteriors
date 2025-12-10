(function () {
  const DEFAULT_PHONE = "917977422729"; // country code + number, no plus or spaces
  const DEFAULT_TEXT = "Hello V.V Interiors, I'd like to learn more about your services.";

  function ensureStyleInjected() {
    if (document.getElementById("whatsapp-component-style")) return;
    const style = document.createElement("style");
    style.id = "whatsapp-component-style";
    style.textContent = `
      .whatsapp-float {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 2147483647;
        width: 56px;
        height: 56px;
        background: #25d366;
        color: #fff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }
      .whatsapp-float i {
        font-size: 28px;
        line-height: 1;
      }
      .whatsapp-float:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 24px rgba(0, 0, 0, 0.24);
      }
    `;
    document.head.appendChild(style);
  }

  function encodeMessage(message) {
    try {
      return encodeURIComponent(message);
    } catch (e) {
      return message;
    }
  }

  function createButton(phone, text) {
    // Avoid duplicates if script is included twice
    if (document.querySelector("a.whatsapp-float[data-component='whatsapp']")) return;

    const href = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeMessage(text)}`;
    const anchor = document.createElement("a");
    anchor.href = href;
    anchor.className = "whatsapp-float";
    anchor.target = "_blank";
    anchor.rel = "noopener";
    anchor.setAttribute("aria-label", "Chat on WhatsApp");
    anchor.setAttribute("title", "Chat on WhatsApp");
    anchor.setAttribute("data-component", "whatsapp");

    const icon = document.createElement("i");
    icon.className = "fab fa-whatsapp";
    anchor.appendChild(icon);

    document.body.appendChild(anchor);
  }

  function initWhatsAppComponent(options) {
    const phone = (options && options.phone) || DEFAULT_PHONE;
    const text = (options && options.text) || DEFAULT_TEXT;
    ensureStyleInjected();
    createButton(phone, text);
  }

  // Expose for optional customization before DOMContentLoaded
  window.initWhatsAppComponent = initWhatsAppComponent;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      initWhatsAppComponent();
    });
  } else {
    initWhatsAppComponent();
  }
})();



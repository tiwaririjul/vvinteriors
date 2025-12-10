    (function () {
  const PHONE_DISPLAY = "+91 7977422729";
  const PHONE_CALL = "+917977422729"; // tel requires plus
  const WHATSAPP = "917977422729"; // wa requires no plus
  const EMAIL = "tiwaririjul13@gmail.com";
  const POPUP_DELAY_MS = 6000; // show after 6s
  const STORAGE_KEY = "vv_cta_popup_seen"; // localStorage: show only once until cleared

  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach((k) => {
        if (k === "style" && typeof attrs[k] === "object") {
          Object.assign(node.style, attrs[k]);
        } else if (k === "dataset") {
          Object.keys(attrs[k]).forEach((d) => (node.dataset[d] = attrs[k][d]));
        } else if (k in node) {
          node[k] = attrs[k];
        } else {
          node.setAttribute(k, attrs[k]);
        }
      });
    }
    (children || []).forEach((c) => node.appendChild(typeof c === "string" ? document.createTextNode(c) : c));
    return node;
  }

  function ensureStyles() {
    if (document.getElementById("contact-cta-style")) return;
    const s = el("style", { id: "contact-cta-style" });
    s.textContent = `
      .cta-fab { position: fixed; right: 20px; bottom: 90px; z-index: 2147483646; }
      .cta-fab button { width: 56px; height: 56px; border-radius: 50%; border: none; color: #fff; background:#007bff; box-shadow: 0 8px 20px rgba(0,0,0,.2); cursor: pointer; transition: transform .2s, box-shadow .2s; }
      .cta-fab button:hover { transform: translateY(-2px); box-shadow: 0 10px 24px rgba(0,0,0,.24); }
      .cta-panel { position: fixed; right: 20px; bottom: 150px; width: 260px; background: #fff; border-radius: 12px; box-shadow: 0 12px 28px rgba(0,0,0,.18); overflow: hidden; transform: translateY(20px); opacity:0; pointer-events:none; transition: .25s ease; z-index:2147483646; }
      .cta-panel.open { transform: translateY(0); opacity:1; pointer-events:auto; }
      .cta-panel-header { background:#007bff; color:#fff; padding:12px 14px; display:flex; align-items:center; justify-content:space-between; }
      .cta-panel-body { padding: 8px; }
      .cta-action { display:flex; align-items:center; padding:10px; border-radius:8px; color:#333; text-decoration:none; transition: background .2s; }
      .cta-action:hover { background:#f5f7fb; }
      .cta-action i { width:28px; text-align:center; font-size:18px; color:#007bff; margin-right:10px; }
      .cta-popup { position: fixed; right: 20px; bottom: 90px; width: 300px; background:#ffffff; border-left: 4px solid #007bff; box-shadow: 0 12px 28px rgba(0,0,0,.18); border-radius:10px; padding:14px; z-index:2147483646; display:none; }
      .cta-popup.show { display:block; animation: cta-pop .25s ease; }
      @keyframes cta-pop { from { transform: translateY(10px); opacity:0 } to { transform: translateY(0); opacity:1 } }
      .cta-popup h5 { margin:0 0 6px 0; font-size:16px; color:#111 }
      .cta-popup p { margin:0 0 10px 0; color:#444; font-size:14px }
      .cta-popup .cta-row { display:flex; gap:8px }
      .cta-popup a { flex:1; text-align:center; text-decoration:none; padding:8px 10px; border-radius:8px; font-weight:600; }
      .cta-popup a.primary { background:#007bff; color:#fff }
      .cta-popup a.secondary { background:#f1f4f9; color:#0b132a }
      .cta-close { background:transparent; border:none; color:#fff; cursor:pointer; font-size:18px }
      /* Mobile bottom bar */
      @media (max-width: 575.98px) {
        .cta-bottom-bar { position: fixed; left:0; right:0; bottom:0; background:#ffffff; border-top:1px solid #e6e9ef; display:flex; z-index:2147483646 }
        .cta-bottom-bar a { flex:1; text-align:center; padding:10px 8px; text-decoration:none; color:#0b132a; font-weight:600 }
        .cta-bottom-bar a i { display:block; font-size:18px; color:#007bff; margin-bottom:4px }
      }
    `;
    document.head.appendChild(s);
  }

  function buildPanel() {
    const header = el("div", { className: "cta-panel-header" }, [
      el("span", null, ["Reach Us"]),
      el("button", { className: "cta-close", title: "Close", onclick: () => panel.classList.remove("open") }, ["×"]),
    ]);

    const actions = el("div", { className: "cta-panel-body" }, [
      el("a", { className: "cta-action", href: `tel:${PHONE_CALL}` }, [el("i", { className: "fas fa-phone" }), el("div", null, [el("div", { style: { fontWeight: "600" } }, ["Call Us"]), el("small", null, [PHONE_DISPLAY])])]),
      el("a", { className: "cta-action", href: `https://api.whatsapp.com/send?phone=${WHATSAPP}`, target: "_blank", rel: "noopener" }, [el("i", { className: "fab fa-whatsapp" }), el("div", null, [el("div", { style: { fontWeight: "600" } }, ["WhatsApp"]), el("small", null, ["Quick chat on WhatsApp"])])]),
      el("a", { className: "cta-action", href: `mailto:${EMAIL}` }, [el("i", { className: "fas fa-envelope" }), el("div", null, [el("div", { style: { fontWeight: "600" } }, ["Email Us"]), el("small", null, [EMAIL])])]),
    ]);

    const panel = el("div", { className: "cta-panel" }, [header, actions]);
    return panel;
  }

  function buildFab(panel) {
    const btn = el("button", { title: "Contact Us" }, [el("i", { className: "fas fa-comments" })]);
    btn.addEventListener("click", () => panel.classList.toggle("open"));
    return el("div", { className: "cta-fab" }, [btn]);
  }

  function buildPopup() {
    if (document.getElementById("contact-cta-popup")) return document.getElementById("contact-cta-popup");
    const root = el("div", { className: "cta-popup", id: "contact-cta-popup" });
    const title = el("h5", null, ["Have a question?"]);
    const desc = el("p", null, ["We're here to help. Reach us instantly."]);
    const row = el("div", { className: "cta-row" }, [
      el("a", { className: "primary", href: `https://api.whatsapp.com/send?phone=${WHATSAPP}`, target: "_blank", rel: "noopener" }, ["WhatsApp"]),
      el("a", { className: "secondary", href: `tel:${PHONE_CALL}` }, ["Call Us"]),
    ]);
    root.appendChild(title); root.appendChild(desc); root.appendChild(row);
    return root;
  }

  function buildBottomBar() {
    const bar = el("div", { className: "cta-bottom-bar" }, [
      el("a", { href: `https://api.whatsapp.com/send?phone=${WHATSAPP}`, target: "_blank", rel: "noopener" }, [el("i", { className: "fab fa-whatsapp" }), "WhatsApp"]),
      el("a", { href: `tel:${PHONE_CALL}` }, [el("i", { className: "fas fa-phone" }), "Call"]),
      el("a", { href: `mailto:${EMAIL}` }, [el("i", { className: "fas fa-envelope" }), "Email"]),
    ]);
    return bar;
  }

  function init() {
    ensureStyles();

    const panel = buildPanel();
    const fab = buildFab(panel);
    const popup = buildPopup();
    const bottomBar = buildBottomBar();

    document.body.appendChild(panel);
    document.body.appendChild(fab);
    if (!document.getElementById("contact-cta-popup")) {
      document.body.appendChild(popup);
    }
    document.body.appendChild(bottomBar);

    // Timed popup once globally (until cache cleared)
    try {
      const hasSeen = localStorage.getItem(STORAGE_KEY) === "1";
      if (!hasSeen) {
        setTimeout(() => {
          popup.classList.add("show");
          try { localStorage.setItem(STORAGE_KEY, "1"); } catch (e) {}
          // hide after 10s if no action
          setTimeout(() => popup.classList.remove("show"), 10000);
        }, POPUP_DELAY_MS);
      }
    } catch (e) {
      // Fallback: if localStorage blocked, still show once per page
      setTimeout(() => {
        popup.classList.add("show");
        setTimeout(() => popup.classList.remove("show"), 10000);
      }, POPUP_DELAY_MS);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();



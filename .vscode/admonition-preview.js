/**
 * Transforma la sintaxis de admonitions y details de MkDocs/Material
 * en elementos HTML estilizados dentro del preview de VS Code.
 *
 * Soporta:
 *   !!! type "Título"        → admonition estática
 *   ??? type "Título"        → <details> colapsable
 *   === "Pestaña"            → tabs (simplificados como secciones)
 */
(function () {
  const ICONS = {
    note:     '📝',
    info:     'ℹ️',
    tip:      '💡',
    warning:  '⚠️',
    danger:   '🔴',
    success:  '✅',
    example:  '📌',
    question: '❓',
    abstract: '📋',
    bug:      '🐛',
    quote:    '💬',
  };

  function iconFor(type) {
    return ICONS[type.toLowerCase()] || '📄';
  }

  function titleFor(type, raw) {
    if (raw) return raw;
    return type.charAt(0).toUpperCase() + type.slice(1);
  }

  /**
   * Recorre los nodos hijos de `container` y transforma admonitions.
   * Modifica el DOM en el lugar.
   */
  function transform(container) {
    // Trabajamos sobre una copia estática del array para poder mutar el DOM
    const children = Array.from(container.childNodes);
    let i = 0;

    while (i < children.length) {
      const node = children[i];

      if (node.nodeType !== Node.ELEMENT_NODE || node.tagName !== 'P') {
        i++;
        continue;
      }

      const text = node.textContent.trim();

      // ── Admonition / Details ─────────────────────────────────────
      // Formato: !!! type "Título opcional"  ó  ??? type "Título opcional"
      const admMatch = text.match(/^(!{3}|\?{3})\s+(\w+)(?:\s+"([^"]*)")?/);

      if (admMatch) {
        const isDetails = admMatch[1] === '???';
        const type      = admMatch[2].toLowerCase();
        const title     = titleFor(type, admMatch[3]);

        // Recoger bloques de contenido siguientes (pre, p, ul, ol, blockquote)
        const bodyNodes = [];
        let j = i + 1;
        while (j < children.length) {
          const sib = children[j];
          // Los bloques de 4 espacios en CommonMark quedan como <pre><code>
          // o como párrafos — los tomamos todos hasta el siguiente admonition
          if (sib.nodeType === Node.ELEMENT_NODE) {
            const sibText = sib.textContent.trim();
            if (sibText.match(/^(!{3}|\?{3})\s+\w+/) || sibText.match(/^={3}\s+"/)) break;
            bodyNodes.push(sib);
            j++;
          } else {
            j++;
          }
          // Tomamos solo un bloque para no "comernos" lo que sigue
          break;
        }

        // Construir el elemento
        const bodyHTML = bodyNodes.map(n => n.outerHTML).join('');

        let el;
        if (isDetails) {
          el = document.createElement('details');
          el.className = `admonition ${type}`;
          el.innerHTML = `
            <summary>${iconFor(type)} ${title}</summary>
            <div class="admonition-body">${bodyHTML}</div>
          `;
        } else {
          el = document.createElement('div');
          el.className = `admonition ${type}`;
          el.innerHTML = `
            <div class="admonition-title">${iconFor(type)} ${title}</div>
            <div class="admonition-body">${bodyHTML}</div>
          `;
        }

        node.parentNode.insertBefore(el, node);
        node.remove();
        bodyNodes.forEach(n => { if (n.parentNode) n.parentNode.removeChild(n); });

        // Reiniciar con la lista actualizada
        const updated = Array.from(container.childNodes);
        children.splice(0, children.length, ...updated);
        // Retrocedemos para no saltear nada
        continue;
      }

      // ── Tabs (=== "Label") — simplificados como subtítulos ───────
      const tabMatch = text.match(/^={3}\s+"([^"]*)"/);
      if (tabMatch) {
        const label = tabMatch[1];
        const tab = document.createElement('h4');
        tab.textContent = `🗂 ${label}`;
        tab.style.cssText = 'color:#546e7a; margin: 16px 0 4px; font-size:0.95em;';
        node.parentNode.insertBefore(tab, node);
        node.remove();

        const updated = Array.from(container.childNodes);
        children.splice(0, children.length, ...updated);
        continue;
      }

      i++;
    }
  }

  function run() {
    const article = document.querySelector('.markdown-body') || document.body;
    transform(article);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();

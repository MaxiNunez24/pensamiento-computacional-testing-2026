// El tempo de la pista para las escenas del video: ?golpe=0.4615 (segundos por golpe).
// Sin nada, 120 BPM (0,5 s). Las líneas se escriben a 120 BPM, o sea en "golpes × 0,5", y
// alTempo() las estira o encoge para la pista que toque.
(function () {
    const golpe = Number(new URLSearchParams(location.search).get('golpe')) || 0.5;
    const k = golpe / 0.5;
    window.alTempo = (linea) => linea.map((paso) => ({
        ...paso,
        ...(paso.en !== undefined && { en: paso.en * k }),
        ...(paso.dur !== undefined && { dur: paso.dur * k }),
        ...(typeof paso.espera === 'number' && { espera: paso.espera * k }),
    }));
})();

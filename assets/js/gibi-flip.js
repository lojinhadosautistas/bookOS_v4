/* ==========================================
   GIBI-FLIP.JS
   BookOS - Flipbook
========================================== */

async function initGibiFlip(containerId, pdfPath) {

    const container =
        document.getElementById(containerId);

    if (!container) {
        console.warn(
            `[Gibi] Container não encontrado: ${containerId}`
        );
        return;
    }

    /* Evita inicialização duplicada */

    if (container.dataset.loaded === "true") {
        return;
    }

    container.dataset.loaded = "loading";

    /* Verifica dependências */

    if (typeof pdfjsLib === "undefined") {

        console.error(
            "[Gibi] PDF.js não está carregado."
        );

        container.innerHTML = `
            <div class="component-error">
                PDF.js não está disponível.
            </div>
        `;

        container.dataset.loaded = "error";

        return;
    }

    if (
        typeof St === "undefined" ||
        typeof St.PageFlip === "undefined"
    ) {

        console.error(
            "[Gibi] PageFlip não está carregado."
        );

        container.innerHTML = `
            <div class="component-error">
                PageFlip não está disponível.
            </div>
        `;

        container.dataset.loaded = "error";

        return;
    }

    container.innerHTML = `
        <div style="
            padding:40px;
            text-align:center;
        ">
            Carregando Livro...
        </div>
    `;

    try {

        /* ==========================================
           CARREGAR PDF
        ========================================== */

        const pdf =
            await pdfjsLib
                .getDocument(pdfPath)
                .promise;


        /* ==========================================
           RENDERIZAR PÁGINAS
        ========================================== */

        const pages = [];

        const scale =
            window.devicePixelRatio > 1
                ? 2.5
                : 2;


        for (
            let i = 1;
            i <= pdf.numPages;
            i++
        ) {

            const page =
                await pdf.getPage(i);


            const viewport =
                page.getViewport({
                    scale: scale
                });


            const canvas =
                document.createElement("canvas");


            const context =
                canvas.getContext("2d");


            canvas.width =
                viewport.width;

            canvas.height =
                viewport.height;


            await page.render({

                canvasContext:
                    context,

                viewport:
                    viewport

            }).promise;


            const pageDiv =
                document.createElement("div");


            pageDiv.className =
                "page";


            pageDiv.appendChild(canvas);


            pages.push(pageDiv);

        }


        /* ==========================================
           LIMPAR CONTAINER
        ========================================== */

        container.innerHTML = "";


        /* ==========================================
           CRIAR FLIPBOOK
        ========================================== */

        const flipBook =
            new St.PageFlip(
                container,
                {

                    width: 380,

                    height: 570,

                    size: "fixed",

                    autoSize: false,

                    showCover: true,

                    usePortrait: false,

                    drawShadow: true,

                    mobileScrollSupport: true,

                    flippingTime: 800

                }
            );


        container.flipBook =
            flipBook;


        flipBook.loadFromHTML(
            pages
        );


        /* ==========================================
           CONTROLES
        ========================================== */

        const root =
            container.closest(".gibi-viewer")
            || container.parentElement;


        const prevBtn =
            root.querySelector("#prev-page");


        const nextBtn =
            root.querySelector("#next-page");


        const fullscreenBtn =
            root.querySelector("#fullscreen");


        const indicator =
            root.querySelector("#page-indicator");


        if (indicator) {

            indicator.textContent =
                `1 / ${pdf.numPages}`;

        }


        /* ==========================================
           BOTÃO ANTERIOR
        ========================================== */

        if (prevBtn) {

            prevBtn.addEventListener(
                "click",
                () => {

                    flipBook.flipPrev();

                }
            );

        }


        /* ==========================================
           BOTÃO PRÓXIMO
        ========================================== */

        if (nextBtn) {

            nextBtn.addEventListener(
                "click",
                () => {

                    flipBook.flipNext();

                }
            );

        }


        /* ==========================================
           TELA CHEIA
        ========================================== */

        if (fullscreenBtn) {

            fullscreenBtn.addEventListener(
                "click",
                async () => {

                    try {

                        if (
                            !document.fullscreenElement
                        ) {

                            await root.requestFullscreen();

                        } else {

                            await document.exitFullscreen();

                        }

                    }
                    catch (error) {

                        console.error(
                            "[Gibi] Erro fullscreen:",
                            error
                        );

                    }

                }
            );

        }


        /* ==========================================
           EVENTO DE FLIP
        ========================================== */

        flipBook.on(
            "flip",
            ({ data }) => {

                if (indicator) {

                    indicator.textContent =
                        `${data + 1} / ${pdf.numPages}`;

                }

            }
        );


        /* ==========================================
           FINALIZADO
        ========================================== */

        container.dataset.loaded =
            "true";


        console.log(
            `[Gibi] ${pdfPath} carregado com sucesso.`
        );


    }
    catch (error) {

        console.error(
            "[Gibi] Erro ao carregar PDF:",
            error
        );


        container.dataset.loaded =
            "error";


        container.innerHTML = `
            <div class="component-error">
                Erro ao carregar o Livro.
            </div>
        `;

    }

}


/* ==========================================
   INICIALIZAÇÃO DO LIVRO 1
========================================== */

setTimeout(() => {

    const container =
        document.getElementById("flipbook1");

    if (container) {

        initGibiFlip(
            "flipbook1",
            "assets/bd/cadapasso_livro1.pdf"
        );

    }

}, 100);

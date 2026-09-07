/* =========================================================
   BOOKOS-MAIN.JS
   Funções gerais da interface
========================================================= */


/* =========================================================
   PARTÍCULAS
========================================================= */

if (typeof particlesJS !== "undefined") {

    particlesJS("particles-js", {

        particles: {

            number: {
                value: 60
            },

            color: {
                value: "#b28a52"
            },

            shape: {
                type: "circle"
            },

            opacity: {
                value: 0.18
            },

            size: {
                value: 3
            },

            move: {
                enable: true,
                speed: 1
            }

        }

    });

}


/* =========================================================
   GRÁFICO DE IMPACTO
   Só inicializa se o elemento existir.
========================================================= */

const impactChart =
    document.getElementById("impactChart");


if (
    impactChart &&
    typeof Chart !== "undefined"
) {

    new Chart(impactChart, {

        type: "bar",

        data: {

            labels: [
                "Revisão",
                "NBCT",
                "SICSP",
                "Estudos",
                "Governança"
            ],

            datasets: [

                {

                    label:
                    "Maturidade Operacional",

                    data: [
                        72,
                        94,
                        81,
                        65,
                        92
                    ],

                    borderWidth: 1

                }

            ]

        },

        options: {

            responsive: true,

            plugins: {

                legend: {
                    display: false
                }

            }

        }

    });

}


/* =========================================================
   FIM
========================================================= */

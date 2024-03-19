import { LitElement, html, css } from "/static/libraries/lit/lit-all.min.js";
const TAG_NAME = "fx-chart";

import "/static/libraries/chart/chart.umd.min.js";

class CustomWebComponent extends LitElement {
    constructor() {
        super();
        this.chart = null;
    }

    render() {
        return html`<div style="width: 300px; height: 200px; border: 2px solid orange;"><canvas style="width: 100%; height: 100%; border: 2px solid lime;"></canvas></div>`;
    }

    firstUpdated() {
        this.canvas = this.renderRoot.querySelector("canvas");
        this.initChart();
    }

    initChart() {
        const ctx = this.canvas.getContext("2d");
        this.chart = new Chart(ctx, {
            responsive: false,
            maintainAspectRatio: false,
            type: "bar",
            data: {
                labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
                datasets: [
                    {
                        label: "# of Votes",
                        data: [12, 19, 3, 5, 2, 3],
                        backgroundColor: [
                            "rgba(255, 99, 132, 0.6)",
                            "rgba(54, 162, 235, 0.6)",
                            "rgba(255, 206, 86, 0.6)",
                            "rgba(75, 192, 192, 0.6)",
                            "rgba(153, 102, 255, 0.6)",
                            "rgba(255, 159, 64, 0.6)",
                        ],
                        borderColor: [
                            "rgba(255, 99, 132, 1)",
                            "rgba(54, 162, 235, 1)",
                            "rgba(255, 206, 86, 1)",
                            "rgba(75, 192, 192, 1)",
                            "rgba(153, 102, 255, 1)",
                            "rgba(255, 159, 64, 1)",
                        ],
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        });
    }
}

customElements.define(TAG_NAME, CustomWebComponent);

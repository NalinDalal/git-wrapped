import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
} from "chart.js";

let registered = false;

export function ensureChartRegistered() {
    if (!registered) {
        ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip);
        registered = true;
    }
}

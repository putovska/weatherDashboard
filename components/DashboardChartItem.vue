<template>
    <v-card min-width="0" class="ma-2" :style="{ display: 'flex', flex: 1 }">
        <div :id="id" :style="{ display: 'flex', flex: 1, width: 0 }"></div>
        <v-dialog v-model="dialog" max-width="600px">
            <template v-slot:activator="{ on }">
                <v-btn
                    icon
                    v-on="on"
                    :style="{ position: 'absolute', right: '30px' }"
                >
                    <v-icon> mdi-lead-pencil </v-icon>
                </v-btn>
            </template>
            <chart-settings :id="id" @btnClick="closeSettings"></chart-settings>
        </v-dialog>
        <v-btn
            icon
            @click="remove"
            :style="{ position: 'absolute', right: '0' }"
        >
            <v-icon> mdi-delete </v-icon>
        </v-btn>
    </v-card>
</template>

<script>
import { computed, onMounted, ref, watch } from "@vue/composition-api";
import Highcharts from "highcharts";
import { variables } from "../utils/utils";
import ChartSettings from "./ChartSettings.vue";
import Chart from "~/models/chart";
import Curve from "~/models/curve";
import Measurement from "~/models/measurement";

const timeSuffix = "T00:00";

const hc = {
    xAxis: {
        type: "datetime",
        labels: {
            overflow: "justify",
        },
        title: {
            text: "UTC time",
        },
    },
    tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat:
            '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
        shared: true,
        useHTML: true,
    },
    plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0,
        },
        series: {
            pointInterval: 3600000, // one hour
        },
    },
};

export default {
    components: { ChartSettings },
    props: {
        id: {
            type: String,
            required: true,
        },
    },
    setup(props) {
        const chart = computed(() => Chart.find(props.id));
        const curves = computed(() =>
            Curve.query().where("chart_id", props.id).get()
        );

        const dialog = ref(false);

        function remove() {
            Chart.delete(props.id);
        }

        function closeSettings() {
            dialog.value = false;
        }

        function updateChart() {
            const { startDate, endDate } = chart.value;
            const start = new Date(startDate + timeSuffix);
            const end = new Date(endDate + timeSuffix);
            const series = curves.value.map((curve) => {
                const measurements = Measurement.query()
                    .where((meas) => {
                        const date = new Date(meas.time);
                        return (
                            meas.city === curve.city &&
                            date >= start &&
                            date <= end
                        );
                    })
                    .get();

                const date = new Date(chart.value.startDate + timeSuffix);
                const offset = date.getTimezoneOffset() * 60 * 1000;
                const utcDate = new Date(date.getTime() - offset);

                return {
                    name: `${curve.city} / ${variables[curve.variable].title}`,
                    data: measurements.map((m) => m[curve.variable]),
                    color: curve.color,
                    pointStart: utcDate.getTime(),
                };
            });

            Highcharts.chart(props.id, {
                ...hc,
                chart: {
                    type: chart.value.type,
                    height: 300,
                },
                title: {
                    text: chart.value.title,
                },
                series,
            });
        }

        onMounted(() => updateChart());
        watch(chart, () => updateChart());

        return {
            closeSettings,
            dialog,
            remove,
        };
    },
};
</script>

<template>
    <div class="charts">
        <v-dialog v-model="dialog" max-width="600px">
            <template v-slot:activator="{ on }">
                <v-toolbar color="transparent" flat max-height="0">
                    <v-spacer></v-spacer>
                    <v-btn icon v-on="on" :disabled="charts.length >= 4">
                        <v-icon>mdi-chart-box-plus-outline</v-icon>
                    </v-btn>
                </v-toolbar>
            </template>
            <chart-settings
                @btnClick="closeSettings"
                v-model="id"
            ></chart-settings>
        </v-dialog>
        <v-layout class="pr-10 chart-layout">
            <div v-for="chart in charts" :key="chart.id" class="chart-wrapper">
                <dashboard-chart-item :id="chart.id"></dashboard-chart-item>
            </div>
        </v-layout>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "@vue/composition-api";
import ChartSettings from "~/components/ChartSettings.vue";
import DashboardChartItem from "~/components/DashboardChartItem.vue";
import Chart from "~/models/chart";

export default defineComponent({
    components: { ChartSettings, DashboardChartItem },

    setup() {
        const dialog = ref(false);
        const id = ref(null);
        const charts = computed(() => Chart.all());

        function closeSettings() {
            dialog.value = false;
            id.value = null;
        }

        return {
            closeSettings,
            id,
            dialog,
            charts,
        };
    },
});
</script>

<style scoped>
.charts {
    display: flex;
    height: 100%;
    flex-direction: column;
}
.chart-layout {
    padding: 0;
    margin: 0;
    display: flex;
    width: 100%;
    min-width: 0;
    flex-wrap: wrap;
}
.chart-wrapper {
    flex: 1;
    min-width: 50%;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    height: auto;
}
</style>

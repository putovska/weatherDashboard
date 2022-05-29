<template>
    <dashboard-charts />
</template>

<script lang="ts">
import { onMounted } from "@vue/composition-api";
import DashboardCharts from "~/components/DashboardCharts.vue";
import { loadData } from "~/utils/loadData";

export default {
    components: { DashboardCharts },
    setup() {
        onMounted(() => {
            loadData();
        });
    },
};
</script>

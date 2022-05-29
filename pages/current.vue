<template>
    <current-temperature v-if="isMeasurenment" />
</template>

<script lang="ts">
import { computed, onMounted } from "@vue/composition-api";
import { loadData } from "~/utils/loadData";
import CurrentTemperature from "~/components/CurrentTemperature.vue";
import Measurement from "~/models/measurement";

export default {
    components: { CurrentTemperature },
    setup() {
        const isMeasurenment = computed(() => Measurement.exists());
        onMounted(() => {
            loadData();
        });
        return {
            isMeasurenment,
        };
    },
};
</script>

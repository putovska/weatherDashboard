<template>
    <v-container>
        <v-select
            :items="cities"
            v-model="city"
            label="Current temperature in"
            :style="{ 'max-width': '300px' }"
            auto
        ></v-select>
        <div class="temperature">{{ temperature }} &#176;C</div>
    </v-container>
</template>

<script>
import { computed, ref } from "@vue/composition-api";
import { cities as citiesObj, getCurrentTimeStamp } from "~/utils/utils";
import Measurement from "~/models/measurement";

export default {
    setup() {
        const cities = Object.keys(citiesObj);
        const city = ref(cities[0]);
        const date = getCurrentTimeStamp();

        const measurement = computed(
            () =>
                Measurement.query()
                    .where((measurement) => {
                        return (
                            measurement.city === city.value &&
                            measurement.time === date
                        );
                    })
                    .get()[0]
        );
        const temperature = computed(() => measurement.value.temperature);

        return {
            cities,
            city,
            date,
            measurement,
            temperature,
        };
    },
};
</script>

<style scoped>
.temperature {
    font-size: 100px;
    font-weight: 300;
    color: #455a64;
}
</style>

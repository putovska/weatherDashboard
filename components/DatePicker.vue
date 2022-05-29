<template>
    <v-menu
        v-model="open"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        min-width="auto"
    >
        <template v-slot:activator="{ on, attrs }">
            <v-text-field
                v-model="date"
                :label="label"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
            ></v-text-field>
        </template>
        <v-date-picker
            v-model="date"
            @input="open = false"
            :allowed-dates="allowedDates"
        ></v-date-picker>
    </v-menu>
</template>

<script lang="ts">
import { ref, watch, defineComponent } from "@vue/composition-api";
import { String } from "@vuex-orm/core";
import Range from "~/models/range";

export default defineComponent({
    props: {
        value: {
            type: String,
            required: true,
        },
        label: {
            type: String,
            required: true,
        },
    },
    setup(props, { emit }) {
        const date = ref(props.value);
        const open = ref(false);

        watch(open, (openValue) => {
            if (!openValue) {
                emit("input", date.value);
            }
        });
        watch(
            () => props.value,
            (value) => {
                date.value = value;
            }
        );
        const { startDate, endDate }: any = Range.query().first();

        const allowedDates = (item: string) => {
            const itemDate = new Date(item);
            return (
                itemDate >= new Date(startDate) && itemDate <= new Date(endDate)
            );
        };

        return {
            allowedDates,
            date,
            open,
        };
    },
});
</script>

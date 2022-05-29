<template>
    <v-menu
        v-model="menu"
        top
        nudge-bottom="105"
        nudge-left="16"
        :close-on-content-click="false"
    >
        <template v-slot:activator="{ on }">
            <div :style="swatchStyle" v-on="on" />
        </template>
        <v-color-picker v-model="color" flat />
    </v-menu>
</template>

<script>
import { computed, ref, watch } from "@vue/composition-api";
export default {
    props: {
        value: {
            type: String,
        },
    },
    setup(props, { emit }) {
        const menu = ref(false);
        const color = ref(props.value);
        const swatchStyle = computed(() => {
            return {
                backgroundColor: color.value,
                cursor: "pointer",
                height: "25px",
                width: "25px",
                borderRadius: menu ? "50%" : "4px",
            };
        });

        watch(color, () => {
            emit("input", color.value);
        });

        return {
            menu,
            color,
            swatchStyle,
        };
    },
};
</script>

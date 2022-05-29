<template>
    <v-app>
        <v-navigation-drawer
            v-model="drawer"
            width="70"
            color="blue-grey lighten-2"
            app
        >
            <v-list class="pt-0" width="69">
                <v-list-item
                    v-for="item in items"
                    :key="item.title"
                    :to="item.to"
                    router
                    exact
                >
                    <v-btn icon>
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-btn>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
        <v-main>
            <v-container class="main-container">
                <Nuxt :style="{ height: '100%', flex: 1 }" />
            </v-container>
        </v-main>
    </v-app>
</template>

<script lang="ts">
import { ref } from "@vue/composition-api";

interface Route {
    title: string;
    to: string;
    icon: string;
}

const routes: Route[] = [
    { title: "Dashboard", to: "/", icon: "mdi-chart-line" },
    {
        title: "Current temperature",
        to: "/current",
        icon: "mdi-thermometer",
    },
];

export default {
    name: "DefaultLayout",
    setup() {
        const drawer = ref(true);
        const items = ref(routes);

        return {
            drawer,
            items,
        };
    },
};
</script>

<style scoped>
#app {
    background-color: #cfd8dc;
}
.main-container {
    width: 100%;
    height: 100%;
    flex: 1;
    display: flex;
}
</style>

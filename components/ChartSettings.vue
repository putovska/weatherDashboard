<template>
    <v-card white>
        <v-card-title>
            <span class="text-h5">Chart settings</span>
        </v-card-title>
        <v-card-text>
            <v-container>
                <v-col no-gutters>
                    <v-row cols="12" sm="6" md="6">
                        <v-text-field
                            v-model="settings.title"
                            required
                            label="Title"
                        ></v-text-field>
                    </v-row>
                    <v-row cols="12">
                        <span class="chart-span">Type</span>
                        <v-btn-toggle
                            v-model="settings.type"
                            tile
                            group
                            label="Type"
                        >
                            <v-btn value="spline" height="30px"> Line </v-btn>
                            <v-btn value="column" height="30px"> Bar </v-btn>
                        </v-btn-toggle>
                    </v-row>
                    <v-row cols="12" class="pt-5">
                        <date-picker
                            v-model="settings.startDate"
                            label="Start date"
                        ></date-picker>
                        <date-picker
                            v-model="settings.endDate"
                            label="End date"
                        ></date-picker>
                    </v-row>
                    <v-row cols="12">
                        <span class="chart-span">Curves</span>
                        <v-btn icon md="1" @click="addCurve">
                            <v-icon> mdi-plus</v-icon>
                        </v-btn>
                    </v-row>
                    <v-row cols="12" v-for="curve in curves" :key="curve.id">
                        <v-col md="5">
                            <v-select
                                dense
                                :items="cities"
                                v-model="curve.city"
                            ></v-select>
                        </v-col>
                        <v-col md="5">
                            <v-select
                                dense
                                :items="variables"
                                v-model="curve.variable"
                            ></v-select>
                        </v-col>
                        <v-col md="1" class="pt-4">
                            <color-picker v-model="curve.color"></color-picker>
                        </v-col>
                        <v-col md="1" class="pt-2">
                            <v-btn icon @click="removeCurve(curve.id)">
                                <v-icon class="pt-1"> mdi-delete </v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-col>
            </v-container>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="discard"> Close </v-btn>
            <v-btn color="blue darken-1" text @click="submit"> Save </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import { reactive, ref } from "@vue/composition-api";
import { v4 as uuidv4 } from "uuid";
import ColorPicker from "./ColorPicker.vue";
import DatePicker from "./DatePicker.vue";
import Chart from "~/models/chart";
import Curve from "~/models/curve";
import Range from "~/models/range";
import {
    cities as citiesObj,
    defaultChartConfig,
    defaultCurveConfig,
    randomColor,
    variables as variablesObj,
} from "~/utils/utils";
export default {
    components: { ColorPicker, DatePicker },
    props: {
        id: {
            type: String,
        },
    },
    setup(props, { emit }) {
        const cities = Object.keys(citiesObj);
        const variables = Object.keys(variablesObj).map((variable) => ({
            text: variablesObj[variable].title,
            value: variable,
        }));

        const range = Range.query().first();
        const { chart: defaultChart, curve: defaultCurve } = defaultChartConfig(
            range.startDate,
            range.endDate
        );
        const chart = props.id ? Chart.find(props.id) : defaultChart;

        const curves = ref(
            props.id
                ? Curve.query().where("chart_id", props.id).get()
                : [defaultCurve]
        );

        const settings = reactive({ ...chart });

        const addedCurveIds = ref(props.id ? [] : [defaultCurve.id]);
        const removedCurveIds = ref([]);

        function addCurve() {
            const newCurveId = uuidv4();
            const color = randomColor();
            curves.value.push(
                new Curve({
                    ...defaultCurveConfig(chart.id),
                    color,
                    id: newCurveId,
                })
            );

            addedCurveIds.value.push(newCurveId);
        }

        function setInitial() {
            for (const setting of Object.keys(settings)) {
                settings[setting] = chart[setting];
            }
            curves.value = Chart.find(chart.id)
                ? Curve.query().where("chart_id", props.id).get()
                : [defaultCurve];
        }

        function discard() {
            setInitial();
            emit("btnClick");
        }

        function removeCurve(curveId) {
            let index = curves.value.findIndex((curve) => curve.id === curveId);
            curves.value.splice(index, 1);

            index = addedCurveIds.value.findIndex((id) => id === curveId);
            addedCurveIds.value.splice(index, 1);

            removedCurveIds.value.push(curveId);
        }

        function submit() {
            // update curves
            for (const curve of curves.value) {
                const { id } = curve;
                if (addedCurveIds.value.includes(id)) {
                    Curve.insert({ data: curve });
                } else {
                    Curve.update(curve);
                }
            }
            Curve.delete((curve) => removedCurveIds.value.includes(curve.id));

            // update charts
            const chartData = { ...settings, id: chart.id };
            if (props.id) {
                Chart.update(chartData);
            } else {
                Chart.insert({ data: chartData });
            }

            if (!props.id) {
                const newChartId = uuidv4();
                chart.id = newChartId;
                for (const curve of curves.value) {
                    curve.chart_id = newChartId;
                    curve.id = uuidv4();
                }
                addedCurveIds.value = curves.value.map((c) => c.id);
            }

            // close dialog
            emit("btnClick");
        }

        return {
            addCurve,
            chart,
            cities,
            curves,
            discard,
            removeCurve,
            settings,
            submit,
            variables,
        };
    },
};
</script>

<style scoped>
.chart-span {
    display: inline-flex;
    align-items: center;
    padding-right: 20px;
}
</style>

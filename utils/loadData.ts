import axios from "axios";

import { cities, defaultChartConfig, variables } from "../utils/utils";

import Chart from "@/models/chart";
import Curve from "@/models/curve";
import Measurement from "@/models/measurement";
import Range from "@/models/range";

const vars = Object.values(variables).map(variable => variable.id).join(",")

const url = (latitude: number, longitude: number) =>
	`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=${vars}`;

const getDate = (datetime: string) => datetime.substring(0, 10);

const parseResult = (result: any, city: string, measurementData: any[]) => {
	const data = result?.data?.hourly;
	if (!data) {
		return;
	}

	const timeStamps = data.time;
	timeStamps.forEach((time: string, index: number) => {
		const variablesData = Object.keys(variables).reduce((acc, variable) => {
			const { id } = variables[variable];
			acc[variable] = data[id][index];
			return acc;
		}, {});
		measurementData.push({
			city,
			time,
			...variablesData
		})
	}
	);
}

export const loadData = async () => {
	if (Measurement.exists()) {
		return;
	}
	const measurementData: any = [];

	const promises = Object.keys(cities).map(async (city) => {
		try {
			const { latitude, longitude } = cities[city];
			const result = await axios.get(url(latitude, longitude));
			parseResult(result, city, measurementData);
		} catch (error) {
			console.warn("No city data", error);
		}
	});

	await Promise.all(promises);

	const startDate = getDate(measurementData[0].time);
	const endDate = getDate(measurementData[measurementData.length - 1].time);

	const { chart, curve } = defaultChartConfig(startDate, endDate);

	Measurement.create({ data: measurementData });
	Chart.create({ data: [chart] });
	Curve.create({ data: [curve] });
	Range.create({ data: [{ startDate, endDate }] });
};

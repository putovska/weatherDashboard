import { v4 as uuidv4 } from "uuid";
import { ChartType, CityCoordinates, Variable } from "~/types/typings";

export const cities: { [key: string]: CityCoordinates } = {
	Berlin: {
		latitude: 52.5235,
		longitude: 13.4115,
	},
	London: {
		latitude: 51.5002,
		longitude: -0.1262,
	},
	Moscow: {
		latitude: 55.7558,
		longitude: 37.6176,
	},
	Paris: {
		latitude: 48.8567,
		longitude: 2.3510,
	},
	Petrozavodsk: {
		latitude: 61.4746,
		longitude: 34.2057
	},
	Rome: {
		latitude: 41.8955,
		longitude: 12.4823,
	}
}

export const variables: { [key: string]: Variable } = {
	temperature: {
		id: "temperature_2m",
		title: "Temperature"
	},
	humidity: {
		id: "relativehumidity_2m",
		title: "Humidity"
	},
	pressure: {
		id: "pressure_msl",
		title: "Pressure"
	},
	precipitation: {
		id: "precipitation",
		title: "Precipitation",
	},
	cloudcover: {
		id: "cloudcover",
		title: "Cloud cover"
	}
}

export const getCurrentTimeStamp = () => {
	const now = new Date();
	const offset = now.getTimezoneOffset() * 60 * 1000;
	const nowUTC = new Date(now.getTime() + offset);

	const yyyy = nowUTC.getFullYear();
	let mm: number | string = nowUTC.getMonth() + 1; // Months start at 0!
	let dd: number | string = nowUTC.getDate()
	let hour: number | string = nowUTC.getHours();

	if (dd < 10) {
		dd = "0" + dd;
	}
	if (mm < 10) {
		mm = "0" + mm;
	}
	if (hour < 10) {
		hour = "0" + hour;
	}

	return yyyy + "-" + mm + "-" + dd + "T" + hour + ":00";
}

export const randomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`;

const defaultCityName = Object.keys(cities)[0];
const defaultChartType: ChartType = "spline";
const defaultChartData = {
	title: defaultCityName,
	type: defaultChartType
}

const defaultVariable = Object.keys(variables)[0];
const defaultCurveData =
{
	city: defaultCityName,
	variable: defaultVariable,
	color: "#78909C",
}

export const defaultChartConfig = (startDate: string, endDate: string) => {
	const chart_id = uuidv4();
	return {
		chart: { ...defaultChartData, id: chart_id, startDate, endDate },
		curve: defaultCurveConfig(chart_id)
	}
}

export const defaultCurveConfig = (chart_id: string) => {
	const curve_id = uuidv4();
	return { ...defaultCurveData, id: curve_id, chart_id };
}

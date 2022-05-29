export type ChartType = "spline" | "column";
export type VariableId = "temperature_2m" | "relativehumidity_2m" | "pressure_msl" | "precipitation" | "cloudcover";

export interface CityCoordinates {
	latitude: number,
	longitude: number
}

export interface Variable {
	id: VariableId,
	title: string
}

import { Model } from '@vuex-orm/core'
import { ChartType } from '~/types/typings';

export default class Chart extends Model {
	static entity = "chart";
	static chartType: ChartType = "spline";

	static fields() {
		return {
			id: this.uid(),
			title: this.attr(''),
			type: this.attr(this.chartType),
			startDate: this.attr(''),
			endDate: this.attr('')
		}
	}
}

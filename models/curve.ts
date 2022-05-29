import { Model } from '@vuex-orm/core'

export default class Curve extends Model {
	static entity = "curve";

	static fields() {
		return {
			id: this.uid(),
			chart_id: this.attr(null),
			city: this.attr(''),
			variable: this.attr(''),
			color: this.attr('')
		}
	}
}

import { Model } from '@vuex-orm/core'

export default class Measurement extends Model {
	static entity = 'measurement'

	static fields() {
		return {
			id: this.attr(null),
			city: this.attr(''),
			time: this.attr(''),
			temperature: this.number(0),
			humidity: this.number(0),
			pressure: this.number(0),
			precipitation: this.number(0),
			cloudcover: this.number(0)
		}
	}
}

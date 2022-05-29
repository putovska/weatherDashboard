import { Model } from '@vuex-orm/core'

export default class Range extends Model {
	static entity = 'range'

	static fields() {
		return {
			id: this.string(''),
			startDate: this.string(''),
			endDate: this.string('')
		}
	}
}

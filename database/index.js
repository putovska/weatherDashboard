import { Database } from '@vuex-orm/core'
import Chart from "~/models/chart";
import Curve from "~/models/curve";
import Measurement from '~/models/measurement';
import Range from '~/models/range';

const database = new Database()

database.register(Chart);
database.register(Curve);
database.register(Measurement);
database.register(Range);

export default database;

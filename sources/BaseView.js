import {JetView} from "webix-jet";

export default class BaseView extends JetView {
	constructor(app) {
		super(app);
		this._ = app.getService("locale")._;
	}
}

import {JetView} from "webix-jet";

import ActivityPopup from "./activities/activityPopup";
import ActivitiesTableView from "./activities/table";

export default class ActivitiesView extends JetView {
	config() {
		const table = new ActivitiesTableView(this.app);
		const addButton = {
			localId: "buttonAdd",
			view: "button",
			type: "icon",
			template: this.createButtonIconTemplate("fas fa-plus-square"),
			label: "Add activity",
			width: 150,
			click: () => {
				table.unselectAll();
				this._activityPopup.showPopup(null);
			}
		};

		return {
			margin: 10,
			padding: 10,
			rows: [
				{cols: [{}, addButton]},
				table
			]
		};
	}

	init() {
		this._activityPopup = this.ui(ActivityPopup);
	}

	createButtonIconTemplate(icon) {
		return `<button type="button" class="webix_button webix_img_btn" style="line-height:32px">
					<div style='display:flex;align-items: center; justify-content: center'>
						<span style='display:inline' class='${icon}'></span>&nbsp;#label#
					</div>
				</button>`;
	}
}

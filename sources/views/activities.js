import {JetView} from "webix-jet";

import {SERVER_FORMAT} from "../helpers";
import activitiesCollection from "../models/activities";
import ActivityPopup from "./activities/activityPopup";
import ActivitiesTableView from "./activities/table";

export default class ActivitiesView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		const addButton = {
			localId: "buttonAdd",
			view: "button",
			type: "icon",
			template: this.createButtonIconTemplate("fas fa-plus-square"),
			label: _("Add activity"),
			width: 150,
			click: () => this._activityPopup.showPopup()
		};

		const tabbar = {
			view: "tabbar",
			options: [
				_("All"),
				_("Overdue"),
				_("Completed"),
				_("Today"),
				_("Tomorrow"),
				_("This week"),
				_("This month")
			],
			on: {
				onAfterTabClick: this.onAfterFilterTabClick
			}
		};
		const spacer = {maxWidth: 80};
		return {
			margin: 10,
			padding: 10,
			rows: [
				{cols: [tabbar, spacer, addButton]},
				ActivitiesTableView
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

	onAfterFilterTabClick(tab) {
		const _ = this.$scope.app.getService("locale")._;
		function addDays(date, days) {
			const timespan = new Date().setDate(date.getDate() + days);
			return new Date(timespan);
		}

		const todayDateTime = Date.now();
		const todayDate = webix.Date.dayStart(Date.now());
		const formatter = webix.Date.strToDate(SERVER_FORMAT);

		switch (tab) {
			case _("Overdue"):
				activitiesCollection.filter((obj) => {
					const date = formatter(obj.DueDate);
					return obj.State === "Open" && date.getTime() < todayDateTime;
				});
				break;
			case _("Completed"):
				activitiesCollection.filter("State", "Close");
				break;
			case _("Today"):
				activitiesCollection.filter((obj) => {
					const date = webix.Date.dayStart(formatter(obj.DueDate));
					return webix.Date.equal(date, todayDate);
				});
				break;
			case _("Tomorrow"):
				activitiesCollection.filter((obj) => {
					const date = webix.Date.dayStart(formatter(obj.DueDate));
					const tomorrow = webix.Date.dayStart(addDays(todayDate, 1));
					return webix.Date.equal(date, tomorrow);
				});
				break;
			case _("This week"):
				activitiesCollection.filter((obj) => {
					const date = webix.Date.dayStart(formatter(obj.DueDate));
					const date2 = webix.Date.dayStart(addDays(todayDate, -7));
					return date > date2 && date < todayDate;
				});
				break;
			case _("This month"):
				activitiesCollection.filter((obj) => {
					const date = webix.Date.dayStart(formatter(obj.DueDate));
					const date2 = webix.Date.dayStart(addDays(todayDate, -30));
					return date > date2 && date < todayDate;
				});
				break;
			case _("All"):
			default:
				activitiesCollection.filter(() => true);
		}
	}
}

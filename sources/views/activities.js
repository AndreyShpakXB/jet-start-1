import BaseView from "../BaseView";
import {SERVER_FORMAT, STATUSES} from "../helpers";
import activitiesCollection from "../models/activities";
import ActivityPopup from "./activities/activityPopup";
import ActivitiesTableView from "./activities/table";

export default class ActivitiesView extends BaseView {
	config() {
		const addButton = {
			localId: "buttonAdd",
			view: "button",
			type: "icon",
			template: this.createButtonIconTemplate("fas fa-plus-square"),
			label: this._("Add activity"),
			width: 150,
			click: () => this._activityPopup.showPopup()
		};

		const tabbar = {
			view: "tabbar",
			localId: "tabbar",
			options: [
				{id: "all", value: this._("All")},
				{id: "overdue", value: this._("Overdue")},
				{id: "completed", value: this._("Completed")},
				{id: "today", value: this._("Today")},
				{id: "tomorrow", value: this._("Tomorrow")},
				{id: "week", value: this._("This week")},
				{id: "month", value: this._("This month")}
			],
			on: {
				onChange: this.onTabChanged.bind(this)
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
		const tabbar = this.$$("tabbar");
		this._activityPopup = this.ui(ActivityPopup);
		this.on(activitiesCollection.data, "onStoreUpdated", (id, obj, mode) => {
			if (mode === "update" || mode === "add") {
				if (tabbar) {
					const tab = tabbar.getValue();
					this.onTabChanged(tab);
				}
			}
		});
		// this.on(this.app, "onActivitiesCollectionUpdated", () => {
		// 	if (tabbar) {
		// 		const tab = tabbar.getValue();
		// 		this.onTabChanged(tab);
		// 	}
		// });
	}

	createButtonIconTemplate(icon) {
		return `<button type="button" class="webix_button webix_img_btn" style="line-height:32px">
					<div style='display:flex;align-items: center; justify-content: center'>
						<span style='display:inline' class='${icon}'></span>&nbsp;#label#
					</div>
				</button>`;
	}

	onTabChanged(tab) {
		const todayDateTime = Date.now();
		const todayDate = webix.Date.dayStart(Date.now());
		const formatter = webix.Date.strToDate(SERVER_FORMAT);

		switch (tab) {
			case "overdue":
				activitiesCollection.filter((obj) => {
					if (!obj.DueDate) return false;
					const date = formatter(obj.DueDate);
					return obj.State === STATUSES.OPEN && date.getTime() < todayDateTime;
				});
				break;
			case "completed":
				activitiesCollection.filter("State", STATUSES.CLOSE);
				break;
			case "today":
				activitiesCollection.filter((obj) => {
					if (!obj.DueDate) return false;
					const date = webix.Date.dayStart(formatter(obj.DueDate));
					return webix.Date.equal(date, todayDate);
				});
				break;
			case "tomorrow":
				activitiesCollection.filter((obj) => {
					if (!obj.DueDate) return false;
					const date = webix.Date.dayStart(formatter(obj.DueDate));
					const tomorrow = webix.Date.dayStart(this.addDays(todayDate, 1));
					return webix.Date.equal(date, tomorrow);
				});
				break;
			case "week":
				activitiesCollection.filter((obj) => {
					if (!obj.DueDate) return false;
					const date = webix.Date.dayStart(formatter(obj.DueDate));
					const date2 = webix.Date.dayStart(this.addDays(todayDate, -7));
					return date > date2 && date < todayDate;
				});
				break;
			case "month":
				activitiesCollection.filter((obj) => {
					if (!obj.DueDate) return false;
					const date = webix.Date.dayStart(formatter(obj.DueDate));
					const date2 = webix.Date.dayStart(this.addDays(todayDate, -30));
					return date > date2 && date < todayDate;
				});
				break;
			case "all":
			default:
				activitiesCollection.filter();
		}
	}

	addDays(date, days) {
		const timespan = new Date().setDate(date.getDate() + days);
		return new Date(timespan);
	}
}

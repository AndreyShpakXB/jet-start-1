import {JetView} from "webix-jet";

import {SERVER_FORMAT} from "../helpers";
import activitiesCollection from "../models/activities";
import ActivityPopup from "./activities/activityPopup";
import ActivitiesTableView from "./activities/table";

export default class ActivitiesView extends JetView {
	config() {
		const addButton = {
			localId: "buttonAdd",
			view: "button",
			type: "icon",
			template: this.createButtonIconTemplate("fas fa-plus-square"),
			label: "Add activity",
			width: 150,
			click: () => this._activityPopup.showPopup()
		};

		const tabbar = {
			view: "tabbar",
			options: [
				"All",
				"Overdue",
				"Completed",
				"Today",
				"Tomorrow",
				"This week",
				"This month"
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
		function addDays(date, days) {
			const timespan = new Date().setDate(date.getDate() + days);
			return new Date(timespan);
		}

		const todayDateTime = Date.now();
		const todayDate = webix.Date.dayStart(Date.now());
		const formatter = webix.Date.strToDate(SERVER_FORMAT);

		switch (tab) {
			case "Overdue":
				activitiesCollection.filter((obj) => {
					const date = formatter(obj.DueDate);
					return obj.State === "Open" && date.getTime() < todayDateTime;
				});
				break;
			case "Completed":
				activitiesCollection.filter("State", "Close");
				break;
			case "Today":
				activitiesCollection.filter((obj) => {
					const date = webix.Date.dayStart(formatter(obj.DueDate));
					return webix.Date.equal(date, todayDate);
				});
				break;
			case "Tomorrow":
				activitiesCollection.filter((obj) => {
					const date = webix.Date.dayStart(formatter(obj.DueDate));
					const tomorrow = webix.Date.dayStart(addDays(todayDate, 1));
					return webix.Date.equal(date, tomorrow);
				});
				break;
			case "This week":
				activitiesCollection.filter((obj) => {
					const date = webix.Date.dayStart(formatter(obj.DueDate));
					const date2 = webix.Date.dayStart(addDays(todayDate, -7));
					return date > date2 && date < todayDate;
				});
				break;
			case "This month":
				activitiesCollection.filter((obj) => {
					const date = webix.Date.dayStart(formatter(obj.DueDate));
					const date2 = webix.Date.dayStart(addDays(todayDate, -30));
					return date > date2 && date < todayDate;
				});
				break;
			case "All":
			default:
				activitiesCollection.filter(() => true);
		}
	}
}

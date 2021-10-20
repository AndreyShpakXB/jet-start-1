import {JetView} from "webix-jet";

import activityTypes from "../models/activityTypes";
import statusesCollection from "../models/statuses";
import ItemPopup from "./settings/popup";
import EditTableView from "./settings/table";

export default class SettingsView extends JetView {
	config() {
		return this.webix.promise.all([
			statusesCollection.waitData,
			activityTypes.waitData
		]).then(() => {
			const lang = this.app.getService("locale").getLang();
			const _ = this.app.getService("locale")._;
			const segmented = {
				localId: "segmented_button",
				view: "segmented",
				options: [
					{id: "en", value: _("English")},
					{id: "ru", value: _("Russian")}
				],
				value: lang,
				click: () => this.toggleLanguage()
			};
			const language = {
				padding: 1,
				cols: [
					{template: _("Language"), borderless: true, width: 150},
					segmented
				]
			};

			const statuses = new EditTableView(this.app, statusesCollection);
			const types = new EditTableView(this.app, activityTypes);
			const tabs = {
				localId: "tabbar",
				view: "tabbar",
				multiview: true,
				options: [
					{value: _("Activity types"), id: "activitytypes"},
					{value: _("Statuses"), id: "statuses"}
				]
			};
			const tabviews = {
				animate: false,
				cells: [
					{id: "activitytypes", rows: [types]},
					{id: "statuses", rows: [statuses]}
				]
			};
			const addbutton = {
				view: "button",
				label: _("Add"),
				click: this.onAddClick
			};
			const tables = {
				rows: [
					tabs,
					tabviews,
					addbutton
				]
			};
			const ui = {
				margin: 50,
				rows: [language, tables]
			};

			return ui;
		});
	}

	onAddClick() {
		const tabbar = this.$scope.$$("tabbar");
		if (tabbar.getValue() === "activitytypes") {
			this.$scope._popup.showPopup(activityTypes);
		}
		else {
			this.$scope._popup.showPopup(statusesCollection);
		}
	}

	init() {
		this._popup = this.ui(ItemPopup);
	}

	toggleLanguage() {
		const langs = this.app.getService("locale");
		const value = this.$$("segmented_button").getValue();
		langs.setLang(value);
	}
}

import BaseView from "../BaseView";
import activityTypes from "../models/activityTypes";
import statusesCollection from "../models/statuses";
import ItemPopup from "./settings/popup";
import EditTableView from "./settings/table";

export default class SettingsView extends BaseView {
	config() {
		return this.webix.promise.all([
			statusesCollection.waitData,
			activityTypes.waitData
		]).then(() => {
			const language = this._getLanguageView();
			const tables = this._getTablesView();
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

	_getLanguageView() {
		const lang = this.app.getService("locale").getLang();
		const segmented = {
			localId: "segmented_button",
			view: "segmented",
			options: [
				{id: "en", value: "English"},
				{id: "ru", value: "Русский"}
			],
			value: lang,
			click: () => this.toggleLanguage()
		};
		return {
			padding: 1,
			cols: [
				{template: this._("Language"), borderless: true, width: 150},
				segmented
			]
		};
	}

	_getTablesView() {
		const statuses = new EditTableView(this.app, statusesCollection);
		const types = new EditTableView(this.app, activityTypes);
		const tabs = {
			localId: "tabbar",
			view: "tabbar",
			multiview: true,
			options: [
				{value: this._("Activity types"), id: "activitytypes"},
				{value: this._("Statuses"), id: "statuses"}
			],
			on: {
				onChange() {
					types.editCancel();
					statuses.editCancel();
				}
			}
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
			label: this._("Add"),
			click: this.onAddClick
		};
		const tables = {
			rows: [
				tabs,
				tabviews,
				addbutton
			]
		};
		return tables;
	}
}

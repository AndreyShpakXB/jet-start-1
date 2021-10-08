import {JetView, plugins} from "webix-jet";

export default class TopView extends JetView {
	config() {
		const header = {
			localId: "title",
			type: "header",
			template: "App",
			css: "app-title"
		};

		const menu = {
			view: "menu",
			id: "top:menu",
			width: 180,
			layout: "y",
			select: true,
			data: [
				{value: "Contacts", id: "contacts", icon: "fas fa-tag"},
				{value: "Activities", id: "activities", icon: "wxi-pencil"},
				{value: "Settings", id: "settings", icon: "fas fa-cogs"}
			]
		};

		const ui = {
			rows: [
				header,
				{cols: [
					menu, {$subview: true}
				]}
			]
		};

		return ui;
	}

	init() {
		this.use(plugins.Menu, "top:menu");
	}
}

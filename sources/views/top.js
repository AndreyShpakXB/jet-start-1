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
				{value: "<span class='fas fa-users'></span> Contacts", id: "contacts"},
				{value: "<span class='fas fa-table'></span> Activities", id: "activities"},
				{value: "<span class='fas fa-cogs'></span> Settings", id: "settings"}
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

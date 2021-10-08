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
				{value: "Contacts", id: "contacts", icon: "wxi wxi-user"},
				{value: "Activities", id: "activities", icon: "fas fa-user-cog"},
				{value: "Settings", id: "settings", icon: "users-cog"}
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

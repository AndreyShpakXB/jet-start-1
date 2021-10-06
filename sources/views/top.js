import {JetView, plugins} from "webix-jet";

export default class TopView extends JetView {
	config() {
		let header = {
			localId: "title",
			type: "header",
			template: "App",
			css: "app-title"
		};

		let menu = {
			view: "menu",
			id: "top:menu",
			width: 180,
			layout: "y",
			select: true,
			data: [
				{value: "Contacts", id: "contacts", icon: "wxi-columns"},
				{value: "Activities", id: "activities", icon: "wxi-pencil"},
				{value: "Settings", id: "settings", icon: "wxi-pencil"}
			]
		};

		let ui = {
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

import {JetView, plugins} from "webix-jet";

export default class TopView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		const header = {
			localId: "title",
			type: "header",
			template: _("App"),
			css: "app-title"
		};

		const menu = {
			view: "menu",
			id: "top:menu",
			width: 180,
			layout: "y",
			select: true,
			data: [
				{value: `<span class='fas fa-users'></span> ${_("Contacts")}`, id: "contacts"},
				{value: `<span class='fas fa-table'></span> ${_("Activities")}`, id: "activities"},
				{value: `<span class='fas fa-cogs'></span> ${_("Settings")}`, id: "settings"}
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

import URLs from "../urls";

const activitiesCollection = new webix.DataCollection({
	scheme: {
		$init(obj) {
			obj.DueDate = webix.i18n.parseFormatDate(obj.DueDate);
		}
	},
	url: URLs.activitiesUrl,
	save: `rest->${URLs.activitiesUrl}`
});


export default activitiesCollection;

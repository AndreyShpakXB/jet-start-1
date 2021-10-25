import URLs from "../urls";

const activityTypes = new webix.DataCollection({
	scheme: {
		$init(obj) {
			obj.value = obj.Value;
		}
	},
	url: URLs.typesUrl,
	save: `rest->${URLs.typesUrl}`
});

export default activityTypes;

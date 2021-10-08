import URLs from "../urls";

const activitiesCollection = new webix.DataCollection({
	url: URLs.activitiesUrl,
	save: `rest->${URLs.activitiesUrl}`
});

export default activitiesCollection;

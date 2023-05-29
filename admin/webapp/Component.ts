import UIComponent from "sap/ui/core/UIComponent";
import { support } from "sap/ui/Device";
import models from "./model/models";
import ODataModel from "sap/ui/model/odata/v4/ODataModel";
import JSONModel from "sap/ui/model/json/JSONModel";

/**
 * @namespace com.myorg.downtimes
 */
export default class Component extends UIComponent {
	public static metadata = {
		manifest: "json",
	};

	private contentDensityClass: string;

	public init(): void {
		// call the base component's init function
		super.init();

		this.setModel(models.createDeviceModel(), "device");

		//OdataModel instanzieren
		const oData = new ODataModel({
			serviceUrl: sap.ui.require.toUrl("com/myorg/downtimes/admin/"),
			operationMode: "Server",
			autoExpandSelect: true,
			groupId:"$auto",
			groupProperties:{
				update:{
					submit:"API"
				}
			},
			updateGroupId:"$auto"
		});

		this.setModel(oData);

		var listInputModel = new JSONModel({
			recipient: {
				title       : "The maintenance downtime",
    			description : "This is the first maintenance downtime",
    			type        : "OneTime",
    			system      : "System1",
    			startsAt    : "23.05.2023,00:00:00",
    			endsAt      : "24.05.2023,00:00:00",
    			showFrom    : "15.05.2023,00:00:00",
    			showUntil   : "24.05.2023,00:00:00",
			},
		});
		this.setModel(listInputModel, "listInputModel");

		// create the views based on the url/hash
		this.getRouter().initialize();
	}

	/**
	 * This method can be called to determine whether the sapUiSizeCompact or sapUiSizeCozy
	 * design mode class should be set, which influences the size appearance of some controls.
	 *
	 * @public
	 * @return {string} css class, either 'sapUiSizeCompact' or 'sapUiSizeCozy' - or an empty string if no css class should be set
	 */
	public getContentDensityClass(): string {
		if (this.contentDensityClass === undefined) {
			// check whether FLP has already set the content density class; do nothing in this case
			if (
				document.body.classList.contains("sapUiSizeCozy") ||
				document.body.classList.contains("sapUiSizeCompact")
			) {
				this.contentDensityClass = "";
			} else if (!support.touch) {
				// apply "compact" mode if touch is not supported
				this.contentDensityClass = "sapUiSizeCompact";
			} else {
				// "cozy" in case of touch support; default for most sap.m controls, but needed for desktop-first controls like sap.ui.table.Table
				this.contentDensityClass = "sapUiSizeCozy";
			}
		}
		return this.contentDensityClass;
	}
}

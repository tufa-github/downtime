import BaseController from "./BaseController";
import UI5Event from "sap/ui/base/Event";
import Dialog from "sap/m/Dialog";
import List from "sap/m/List";
import JSONModel from "sap/ui/model/json/JSONModel";
import Button from "sap/m/Button";
import StandardListItem from "sap/m/StandardListItem";
import { ListType } from "sap/m/library";

/**
 * @namespace com.myorg.downtimes.controller
 */
export default class App extends BaseController {

	public onInit() : void {
		var route = this.getRouter();
		route.getRoute("detail").attachPatternMatched(this._onRouteMatched,this);
	}
	public _onRouteMatched(event: UI5Event) {
		var path = event.getParameter("arguments"). path;
		this.getView().bindElement({path:"/" + path});
	}
	public onNaviBack() {
		this.onNavBack();
	}

    public handelTypesValueHelp(event:UI5Event): void{
		const dialog = new Dialog({
			title: "Select Type",
      		contentWidth: "300px",
      		contentHeight: "200px",
      		beginButton: new Button({
        		text: "Close",
        		press: function () {
          		dialog.close();
        		}
			})
		});
		const typeModel = new JSONModel({
			types: [
				{ key: "OneTime", text:"OneTime" },
				{ key:"Recurring", text:"Recurring" }
			]
		});
		const list =new List({
			items:{
				path:"/types",
				template: new StandardListItem({
					title:"{text}",
					type: ListType.Active,
					press:(itemEvent:any) =>{
						const selectedType =itemEvent.getSource().getBindingContext().getObject().key;
						const typeModel : JSONModel = this.getView().getModel("listInputModel") as JSONModel;
						typeModel.setProperty("/recipient/type",selectedType);
						dialog.close();
					}
				})
			}
		});
		list.setModel(typeModel);
		dialog.addContent(list);
		dialog.open();
	}
    
}

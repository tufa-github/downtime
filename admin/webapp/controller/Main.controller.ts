import MessageBox from "sap/m/MessageBox";
import BaseController from "./BaseController";
import formatter from "../model/formatter";
import JSONModel from "sap/ui/model/json/JSONModel";
import ColumnListItem from "sap/m/ColumnListItem";
import UI5Event from "sap/ui/base/Event";
import Context from "sap/ui/model/odata/v4/Context";
import ODataListBinding from "sap/ui/model/odata/v4/ODataListBinding";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import Dialog from "sap/m/Dialog";
import Fragment from "sap/ui/core/Fragment";
import List from "sap/m/List";
import StandardListItem from "sap/m/StandardListItem";
import { ListType } from "sap/m/library";
import Controller from "sap/ui/core/mvc/Controller";
import DateTimePicker from "sap/m/DateTimePicker";
import Button from "sap/m/Button";



/**
 * @namespace com.myorg.downtimes.controller
 */
export default class Main extends BaseController {
	private formatter = formatter;
	private addDialog: Dialog;

	
	public onInit(): void {
		const model = new JSONModel({
			hello: "world",
		});
		this.setModel(model, "view");
		
	}

	public onDeletePress(event: UI5Event) {
		const listItem = event.getParameter("listItem") as ColumnListItem;
		const context = listItem.getBindingContext() as Context;
		context.delete();
	}

	public async pressAddInList() {
		if (!this.addDialog) {
			this.addDialog = <Dialog>await Fragment.load({
				name: "com.myorg.downtimes.view.addDowntimesDialog",
				controller: this,
			});
			this.getView().addDependent(this.addDialog);
		}
		this.addDialog.open();
	}

	public closeDialog() {
		this.addDialog.close();
	}

	public dialogAddInDowntimesList() {
		const recipient = this.getView().getModel("listInputModel").getProperty("/recipient");
		const { title, description, system, type, startsAt, endsAt, showFrom, showUntil} = recipient;
	
		const context = (<ODataListBinding>(
		  this.getView().byId("downtimesList").getBinding("items")
		)).create({
		  title,
		  description,
		  system,
		  type,
		  startsAt,
		  endsAt,
		  showFrom,
		  showUntil
		});
		this.closeDialog();
	  }

	public mySearchDowntimes(event: UI5Event) {
		const query = event.getParameter("query");
		const table = this.getView().byId("downtimesList");
		const binding = table.getBinding("items") as ODataListBinding;
		const filters = [];
		if (query) {
			filters.push(new Filter("title", FilterOperator.Contains, query));
		}
		binding.filter(filters);
	}

	public onItemPress(event: UI5Event){
		var item = event.getSource();
		//@ts-ignore
		var context = item.getBindingContext();
		var path = context.getPath().substr(1);
		this.navTo("detail", {path: path});
	}

	public handelTypeValueHelp(event:UI5Event): void{
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
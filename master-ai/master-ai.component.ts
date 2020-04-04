import { element } from "protractor";
import { Component, OnInit, ViewChild } from "@angular/core";
import {
  MatPaginator,
  MatSort,
  MatDialog,
  MatTableDataSource,
  MatDialogConfig
} from "@angular/material";
import { MasterAiFormComponent } from "./master-ai-form/master-ai-form.component";
import { MasterAIService } from "../services/master-ai.service";
import { ProgressComponent } from "../ai-status-view/progress/progress.component";
import { ViewComponent } from "../ai-status-view/view/view.component";
//import { ais } from "./ais";
import { FormArray } from "@angular/forms";

@Component({
  selector: "app-master-ai",
  templateUrl: "./master-ai.component.html",
  styleUrls: ["./master-ai.component.css"]
})
export class MasterAiComponent implements OnInit {
  private AIs;
  categories;
  searchKey: string;
  private displayedColumns: string[] = [
    "AI status",
    "AI Name",
    "ATC Code",
    "Pharmacological Category",
    "Actions"
  ];
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
    private dialog: MatDialog,
    private MasterAIService: MasterAIService
  ) {}

  ngOnInit() {
    this.MasterAIService.getAIs().subscribe((AIs: []) => {
      console.log("our AIs", AIs);
      this.AIs = new MatTableDataSource(AIs);
      this.AIs.sort = this.sort;
      this.AIs.paginator = this.paginator;
    });
    
    this.MasterAIService.getPharmacologicalCategories().subscribe(
      (categories: []) => {
        console.log("our categories ", categories);
        this.categories = categories;
      }
    );
  }
  onAdd() {
    this.MasterAIService.form.reset();
    //to clear form Arrays
    (this.MasterAIService.form.get("pharamaceutical") as FormArray).clear();
    (this.MasterAIService.form.get(
      "AI_Pharmaceutical_Categories_ID"
    ) as FormArray).clear();
    (this.MasterAIService.form.get("AI_ATC_Code") as FormArray).clear();
    (this.MasterAIService.form.get("AI_Alternative_Name") as FormArray).clear();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    dialogConfig.data = { title: "Add New AI", categories: this.categories };
    this.dialog.open(MasterAiFormComponent, dialogConfig);
  }
  onEdit(element) {
    this.MasterAIService.popualteForm(element);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    dialogConfig.data = { title: "Edit AI", categories: this.categories };

    this.dialog.open(MasterAiFormComponent, dialogConfig);
  }

  onSearchClear() {
    this.searchKey = "";
    this.applyFilter();
  }
  applyFilter() {
    if(this.searchKey && this.searchKey!=''){
      this.AIs.filterPredicate = function(data, filter: string): boolean {
        return data['AI_Name'].toLowerCase().includes(filter) 
         
      };
      let filterValue = this.searchKey.trim(); // Remove whitespace
          filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
          this.AIs.filter = filterValue;
    }
    else
    this.AIs.filter = 'a';

  }
  filterByName(btnValue){
    this.AIs.filterPredicate = function(data, filter: string): boolean {
      return data['AI_Name'].toLowerCase()[0]==filter
};
let 
    filterValue = btnValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.AIs.filter = filterValue;
  }
  rowClicked(element) {
    console.log("row clicked", element);
    if (element.AI_Status != 1 && element.AI_Status != 3) {
      this.MasterAIService.getTaskByAICode(element.AI_Code).subscribe(
        response => {
          //open in progress modal
          const dialogConfig = new MatDialogConfig();
          dialogConfig.autoFocus = true;
          dialogConfig.width = "60%";
          dialogConfig.height = "60%";
          dialogConfig.data = { task: response };
          this.dialog.open(ProgressComponent, dialogConfig);
        }
      );
    } else {
      this.MasterAIService.getAIMasterFieldStructure().subscribe(response => {
        //open view ai modal

        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.width = "60%";
        dialogConfig.height = "60%";
        //dialogConfig.data = { task: response };
        this.dialog.open(ViewComponent, dialogConfig);
      });
    }
  }
}

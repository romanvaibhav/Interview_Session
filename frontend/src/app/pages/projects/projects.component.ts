import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../cors/service/auth.service';
import { LoginComponent } from '../../modules/login/login.component';

@Component({
  selector: 'app-projects',
  imports: [CommonModule,FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent {
  roles: string[] | undefined;

  constructor(private cdr: ChangeDetectorRef,private router: ActivatedRoute, private authService:AuthService, private route:Router){
  }
  selectedEmployeeId: any = null;
  selectedEmpId:any;

  searchText: any;
  sortBy: any="Filter";
  sortOrder: string = 'asc';

  projectData:any;
  pageNumbers: number[] = [];
  pages:any;
  isModalOpen = false;
  isUpdate=false;
  pageArray:number[]=[5,10,15,20,25,30];

  userid:any;
  projectId:any;

  ngOnInit(){
    this.roles=[
      "React.js",
      "Angular.js",
      "Javascript",
      "Typescript",
      "Node.js",
    ];
    this.userid=localStorage.getItem("userId");
    console.log("USer ID",this.userid);
    this.projForm.get("userId")?.setValue(this.userid);

    const org_id=this.router.snapshot.queryParams['id'];
    console.log(org_id);
    this.projForm.get("Org_id")?.setValue(org_id);
    console.log(this.projForm.value);
    this.getProjData();
  }

  openModal() {
    console.log("Hello")
    this.isModalOpen = true;
  }
  closeModal() {
    this.isModalOpen = false;
  }

  isclose(){
    this.isUpdate=false;
    this.projForm.reset();
  }

  isupdate(proj:any){
    this.selectedEmployeeId=proj;
    this.projectId=proj._id;
    console.log(this.projectId);
    console.log(this.selectedEmployeeId);
    this.isUpdate=true;
    this.projForm.patchValue({
      title:this.selectedEmployeeId.title || '',
      skills:this.selectedEmployeeId.skills || '',
      StackBlitzUrl:this.selectedEmployeeId.StackBlitzUrl || '',
      userId:this.selectedEmployeeId.userId || '',
    })
    console.log("Form values are",this.projForm.value);
  }



  projForm:FormGroup=new FormGroup({
    title:new FormControl("",[Validators.required]),
    skills:new FormControl([],[Validators.required]),
    StackBlitzUrl:new FormControl("",[Validators.required]),
    userId: new FormControl("")
  })

  projBtn(){
    console.log(this.userid);
    console.log(this.projForm.value);
    this.authService.postProject(this.projForm.value).subscribe({next:(value)=>{
      console.log("Got the values",value);
      this.projectData=value;
      this.isUpdate=false;
      this.projForm.reset();
      this.projForm.get("userId")?.setValue(this.userid);
    },
    error:(err)=>{
      console.log(err);
    }
  })
  }

  sendBtn(){
    console.log(this.userid);
    console.log(this.projForm.value);
    this.authService.patchProject(this.projForm.value,this.projectId).subscribe({next:(value)=>{
      console.log("Got the values",value);
      this.projectData=value;
      this.isUpdate=false;
      this.projForm.reset();

    },
    error:(err)=>{
      console.log(err);
    }
  })
  }

  get skillsArray() {
    return this.projForm.get("skills") as FormArray;
  }

  onSelectChange(event: Event) {
    const selectedOptions = (event.target as HTMLSelectElement).selectedOptions;
    const values = Array.from(selectedOptions).map(option => option.value);

    this.projForm.get("skills")?.setValue(values); // Store selected skills
  }

  deleteBtn(){
    const id=this.selectedEmployeeId!._id;
    console.log("Hello");
    this.authService.deleteProjById(id).subscribe({next:(value)=>{
      console.log("Emp Details Deleted Succesfulyy",value);
      this.getProjData();
      this.isUpdate=false;
    },
    error:(err)=>{
    console.log("Getting error while deleting the Emp Details",err);
    }})
    }

  getProjData(){
    this.authService.getProject().subscribe({next:(value)=>{
      console.log("Got the EmpData",value);
      this.projectData=value;
      console.log("Here is empData",this.projectData);
      // this.pageLimit=this.empData.totalEmployees;
      // this.pages=this.projectData.totalPages;
      // console.log("Total Page",this.pages);
      // this.pageNumbers = [];
      // for (let i = 1; i <= this.pages; i++) {
      //     this.pageNumbers.push(i);
      // }
      // console.log(this.pageNumbers);
    },
    error:(err)=>{
      console.log("Frontend error while fetching empData",err);
    }
  })
  }


  currentPage = 1;
  pageLimit=10;
  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      // this.getEmpData();
    }
  }


  goToNextPage() {
    if (this.currentPage < this.pages) {
      this.currentPage++;
      // this.getEmpData();
    }
  }


  goToPage(page: number) {
    this.currentPage = page;
    // this.getEmpData();
  }
  onPageLimitChange(event: any) {
    console.log("Event Target Value:", event.target.value);
    this.pageLimit = +event.target.value;
    console.log("Updated Page Limit:", this.pageLimit);
    this.currentPage = 1;
    // this.getEmpData();
  }


  applyFilters() {
    console.log("Search Text:", this.searchText, "Sort By:", this.sortBy);  // Debugging

    if (this.searchText || this.sortBy) {  // ✅ Only run if filters exist
      console.log("Applying Filters...");
      this.currentPage = 1;
      // this.getEmpData();
    }
  }

  // logoutBtn(){
  //   this.authService.logout().subscribe({next:(value:any)=>{
  //     localStorage.removeItem('accessToken');
  //     this.route.navigateByUrl("/");

  //   }})
  // }


}

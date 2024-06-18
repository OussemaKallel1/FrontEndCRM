import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ProspectModéle } from '../Modéles/Prospect-Modéle';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AddProspectDialogComponent } from '../add-prospect-dialog/add-prospect-dialog.component';
import { ProspectService } from '../Services/Prospect.service';
import { ClientService } from '../Services/client.service';
import { MatDialog } from '@angular/material/dialog';
import { CoreService } from '../core/core.service';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';
import { Permission } from '../Modéles/Permission';
import { PermissionService } from '../Services/Permission.service';
import { AddPermissionDialogComponent } from '../add-permission-dialog/add-permission-dialog.component';
import { ToastrService } from 'ngx-toastr';
declare var $: any;

@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.css']
})
export class PermissionComponent {
  displayedColumns: string[] = [
    
    'name',
    'action'
  ];
  dataSource!: MatTableDataSource<Permission>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  permission: Permission[] = [];

  permissionToDelete!: Permission;

  Addpermission!: Permission;
  constructor(
    private permissionService: PermissionService,
    private ClientService: ClientService,
    private dialog: MatDialog,
    private coreService: CoreService,
    private toastr: ToastrService,
    private route:Router

  ) {}

  ngOnInit(): void {
    this.loadPermission();
  }

  loadPermission() {
    this.permissionService.getAllPermissions().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  confirmDelete(permission: Permission) {
    $('#deleteModal').modal('show');
    this.permissionToDelete = permission;
  }

  confirmAdd(permission: Permission) {
    $('#addClientModal').modal('show');
    this.Addpermission = permission;
  }

  closeConfirm() {
    $('#deleteModal').modal('hide');
  }
  closeConfirmAdd() {
    $('#addClientModal').modal('hide');
  }
  
  deletePermission() {
    this.permissionService
      .deletePermission(this.permissionToDelete.id)
      .subscribe(() => {
        console.log('deleted');
        this.toastr.success('La permission a été supprimée avec succès', 'Succès');
        this.closeConfirm();
        this.loadPermission();
      });
  }

  openAddEditCltForm() {
    const dialogRef = this.dialog.open(AddPermissionDialogComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.loadPermission();
        }
      },
    });
  }

  openEditCltForm(data: ProspectModéle) {
    const dialogRef = this.dialog.open(AddPermissionDialogComponent, {
      data,
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.loadPermission();
        }
      },
    });
  }
}

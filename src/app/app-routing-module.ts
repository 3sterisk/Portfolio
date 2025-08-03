import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeCompoenent } from './components/home/home.compoenent';
import { AdminComponent } from './components/admin/admin.component';
// import { adminGuard } from './guards/admin-guard';

const routes: Routes = [
  { path: '', component: HomeCompoenent },
  { path: 'admin', component: AdminComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

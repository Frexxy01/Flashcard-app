import { Routes } from '@angular/router';
import { UserpageComponent } from './userpage/userpage.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CategorySelectorComponent } from './category-selector/category-selector.component';
import { AdminpageComponent } from './category-selector/adminpage/adminpage.component';

import { CreateCardComponent } from './category-selector/adminpage/create-card/create-card.component';
import path from 'path';
import { TestpageComponent } from './category-selector/testpage/testpage.component';
import { LearningpageComponent } from './category-selector/learningpage/learningpage.component';
import { LoginGuard } from './guards/login.guard';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
    {path: 'categories/test/:category', component: TestpageComponent, canMatch: [LoginGuard]},
    {path: 'categories/learning/:category', component: LearningpageComponent,  canMatch: [LoginGuard]},
    {path: 'homepage', component: UserpageComponent,  canMatch: [LoginGuard]},
    {path: 'categories', component: CategorySelectorComponent, canMatch: [LoginGuard]},
    {path: 'admin', component:AdminpageComponent, canMatch: [AdminGuard]},
    {path: 'register', component:RegisterComponent},
    {path: 'login', component: LoginComponent},
    {path: '', redirectTo: '/homepage', pathMatch: 'full'},
    {path: '**', component: NotfoundComponent}
];

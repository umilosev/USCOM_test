import { Routes } from '@angular/router';
import { PostList } from '../components/post-list/post-list';
import { PostPage } from '../components/post-page/post-page';

export const routes: Routes = [
    {"path": "", "redirectTo": "posts", "pathMatch": "full"},
    {"path": "posts", component : PostList},
    {"path": "posts/:id", component: PostPage}
];

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPostDialog } from './add-post-dialog';

describe('AddPostDialog', () => {
  let component: AddPostDialog;
  let fixture: ComponentFixture<AddPostDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPostDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPostDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

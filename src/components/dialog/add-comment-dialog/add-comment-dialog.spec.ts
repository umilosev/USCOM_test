import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCommentDialog } from './add-comment-dialog';

describe('AddCommentDialog', () => {
  let component: AddCommentDialog;
  let fixture: ComponentFixture<AddCommentDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCommentDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCommentDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

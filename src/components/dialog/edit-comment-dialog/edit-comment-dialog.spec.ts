import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCommentDialog } from './edit-comment-dialog';

describe('EditCommentDialog', () => {
  let component: EditCommentDialog;
  let fixture: ComponentFixture<EditCommentDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCommentDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCommentDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

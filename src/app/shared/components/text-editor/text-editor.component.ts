import { Component, EventEmitter, Inject, Input, Output, inject } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Editor, Toolbar } from 'ngx-editor';

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss'],
  providers: [FormGroupDirective]
})
export class TextEditorComponent {
  // @Output() editorOutput: EventEmitter<any> = new EventEmitter<any>();
  form = new FormGroup({
    editorContent: new FormControl(
      { value: null, disabled: false },
    ),
  });
  constructor(@Inject(MAT_DIALOG_DATA) public data: any , private editorDialogRef: MatDialogRef<TextEditorComponent>) { }

  ngOnInit() {
    this.form.patchValue({
      editorContent : this.data.editorData
    })
    this.editor = new Editor();
  }
  editor: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  saveClose(){
    const textData = this.editor.view.dom.textContent;  
    const json = this.form.get('editorContent')?.value;
    this.editorDialogRef.close({'json' : json , 'textData' : textData});
  }

  private processWriteUp(editorData : any[]){
    for(let data of editorData){

    }
  }
  ngOnDestroy(): void {
    this.editor.destroy();
  }
}

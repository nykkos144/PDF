import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileControllerComponent } from '../components/file-controller/file-controller/file-controller.component';
import { PDFWIZService } from '../services/pdfwiz.service';
import { FileUploadFieldComponent } from '../components/file-controller/file-upload-field/file-upload-field.component';
import { FileOperatorComponent } from '../components/file-controller/file-operator/file-operator.component';
import { PageEditorComponent } from '../components/file-controller/page-editor/page-editor.component';
import { OptionsOperatorComponent } from '../components/file-controller/options-operator/options-operator.component';
import { PageEditorModalComponent } from '../components/file-controller/page-editor-modal/page-editor-modal.component';
import { ProtectOperatorComponent } from '../components/file-controller/protect-operator/protect-operator.component';



@NgModule({
  declarations: [
    FileControllerComponent,
    FileUploadFieldComponent,
    FileOperatorComponent,
    PageEditorComponent,
    OptionsOperatorComponent,
    PageEditorModalComponent,
    ProtectOperatorComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    FileControllerComponent
  ],
  bootstrap: [FileControllerComponent]
})
export class FileControllerModule { }

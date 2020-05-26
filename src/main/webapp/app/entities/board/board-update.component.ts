import { Component, ElementRef, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { IBoard, Board } from 'app/shared/model/board.model';
import { BoardService } from './board.service';
import { JhiAlertService, JhiDataUtils } from 'ng-jhipster';

@Component({
  selector: 'jhi-board-update',
  templateUrl: './board-update.component.html'
})
export class BoardUpdateComponent implements OnInit {
  isSaving: boolean;

  editForm = this.fb.group({
    id: [],
    title: [],
    content: [],
    image: [], //이미지 바이트 파일
    imageContentType: [], // 이미지 타입(ex. jpeg)
    imageName: [] // 이미지 이름
  });

  constructor(protected imgService: BoardService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ img }) => {
      this.updateForm(img);
    });
  }

  updateForm(img: IBoard) {
    this.editForm.patchValue({
      id: img.id,
      title: img.title,
      content: img.content,
      image: img.image,
      imageContentType: img.imageContentType,
      imageName: img.imageName
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const img = this.createFromForm();
    if (img.id !== undefined) {
      this.subscribeToSaveResponse(this.imgService.update(img));
    } else {
      this.subscribeToSaveResponse(this.imgService.create(img));
    }
  }

  private createFromForm(): IBoard {
    return {
      ...new Board(),
      id: this.editForm.get(['id'])!.value,
      title: this.editForm.get(['title'])!.value,
      content: this.editForm.get(['content'])!.value,
      image: this.editForm.get(['image'])!.value,
      imageContentType: this.editForm.get(['imageContentType'])!.value,
      imageName: this.editForm.get(['imageName'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBoard>>) {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError() {
    this.isSaving = false;
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string) {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null
    });
    if (this.elementRef && idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
  }

  setFileData(event, field: string, isImage) {
    return new Promise((resolve, reject) => {
      if (event && event.target && event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        console.log(file.name);
        if (isImage && !/^image\//.test(file.type)) {
          reject(`File was expected to be an image but was found to be ${file.type}`);
        } else {
          const filedContentType: string = field + 'ContentType';
          const fieldName: string = field + 'Name';
          this.dataUtils.toBase64(file, base64Data => {
            this.editForm.patchValue({
              [field]: base64Data,
              [filedContentType]: file.type,
              [fieldName]: file.name
            });
          });
        }
      } else {
        reject(`Base64 data was not set as file could not be extracted from passed parameter: ${event}`);
      }
    }).then(
      () => console.log('blob added'), // sucess
      this.onError
    );
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}

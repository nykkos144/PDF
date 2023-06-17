import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';
import ToolInterface from 'src/app/interfaces/tool.interface';
import { formatSize } from 'src/app/utils/formatSize';

import * as PDFJS from 'pdfjs-dist';
import { PDFWIZService } from 'src/app/services/pdfwiz.service';

@Component({
  selector: 'page-editor',
  templateUrl: './page-editor.component.html',
  styleUrls: ['./page-editor.component.scss']
})
export class PageEditorComponent {

  constructor (
    private PDFWIZ : PDFWIZService
  ) {}

  @Input() tool : ToolInterface | null = null;
  @Input() file : File | null = null;
  @Input() fileSize : number | null = null;
  
  @Input() updateFileSizeCallback = (size : number) : void => {};
  @Input() submitCallback = () : void => {};

  @ViewChild('slider') slider : ElementRef<HTMLElement> | undefined;
  @ViewChild('shadow') shadow : ElementRef<HTMLImageElement> | undefined;
  @ViewChild('addFileInput') addFileInput : ElementRef<HTMLInputElement> | undefined;

  pdf : any;
  numPages : number = 0;

  pages : Page [] = [];
  
  selectedSeperators : number [] = [];
  splitPoints : number [] = [];

  mouseMove_subscription: Subscription | undefined;
  mouseUp_subscription: Subscription | undefined;

  ngOnInit() {

    if (!this.file) return;

    const pdfWorkerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${ PDFJS.version }/pdf.worker.min.js`;
    PDFJS.GlobalWorkerOptions.workerSrc = pdfWorkerSrc;

    this.renderPDF(this.file, this.pages);

    // this.mouseMove_subscription = fromEvent(document, 'mousemove').subscribe(event => {
    //   this.handleMouseMove(event);
    // });
    // this.mouseUp_subscription = fromEvent(document, 'mouseup').subscribe(event => {
    //   this.handleMouseUp(event);
    // });



  }

  // ngOnChanges(changes : SimpleChanges) {
  //   if (changes['numPages'] && !changes['numPages'].firstChange) {
  //     this.updateSize();
  //   }
  // }

  updateSize = async () => {
    const size = await this.PDFWIZ.getSize();
    this.updateFileSizeCallback(size);
  }

  renderPDF = async (file : File, pageList : Page []) => {

    const pdf = await PDFJS.getDocument(await file.arrayBuffer()).promise;

    this.pdf = pdf;
    this.numPages = pdf.numPages;

    if (!pdf || !pdf.numPages) return;

    for (let i = 1; i < pdf.numPages + 1; i++) {
      const page = await pdf.getPage(i);

      const viewport = page.getViewport({ scale: .5 });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const renderContext : any = {
        canvasContext: ctx,
        viewport: viewport
      }
      
      await page.render(renderContext).promise;
      const url = canvas.toDataURL('image/jpeg', 1);

      pageList.push(new Page(url));
    }

  }


  getModifiedPagesString = () : string => {

    const selectedPages = this.getSelectedPagesIndexes();
    return selectedPages.map(page => page + 1).join(', ');

  }
  getSelectedPages = () : Page [] => {

    const selectedPages = this.pages.filter(page => page.selected);
    return selectedPages;

  }
  getSelectedPagesIndexes = () : number [] => {

    const selectedPages = this.pages
    .map((obj, index) => obj.selected ? index : -1)
    .filter(index => index !== -1);

    return selectedPages;

  }

  handlePageClick = (index : number) => {
    this.pages[index].selected = !this.pages[index].selected;
  }


  dragging : boolean = false;
  draggedPage : number | null = null;
  dragOffset : any = null;

  resetDragging = () => {
    if (!this.shadow) {
      return;
    }

    this.dragging = false;
    this.draggedPage = null;
    this.shadow!.nativeElement.classList.remove('active');
  }

  handlePageMouseDown = (event : any, index : number) => {
    // this.dragging = true;
    this.draggedPage = index;

    this.dragOffset = {
      x: event.clientX - event.currentTarget.offsetLeft,
      y: event.clientY - event.currentTarget.offsetTop
    }
  }

  handlePageMouseUp = (event : any, index : number) => {

    if (!this.dragging) {
      this.handlePageClick(index);
    }

    if (this.draggedPage === null) {
      return;
    }

    if (this.draggedPage == index) {
      this.resetDragging();
      return;
    }

    if (event.shiftKey) {

      [this.pages[index], this.pages[this.draggedPage]] = [this.pages[this.draggedPage], this.pages[index]];

      this.PDFWIZ && this.PDFWIZ.switchPages(this.draggedPage, index);
    }
    else {

      const tempPage = this.pages[this.draggedPage];
      this.pages.splice(this.draggedPage, 1);
      this.pages = [...this.pages.slice(0, index), tempPage, ...this.pages.slice(index)];

      this.PDFWIZ && this.PDFWIZ.movePage(this.draggedPage, index);
    }

    this.resetDragging();

  }

  @HostListener('window:mousemove', ['$event'])
  handleMouseMove = (event : any) => {
    
    if (this.draggedPage === null) {
      return;
    }

    this.dragging = true;

    this.shadow!.nativeElement.classList.add('active');
    this.shadow!.nativeElement.src = this.pages[this.draggedPage].url;

    this.shadow!.nativeElement.style.left = event.clientX - this.slider!.nativeElement.scrollLeft - this.dragOffset.x + 'px';
    this.shadow!.nativeElement.style.top = event.clientY - document.getElementsByClassName('page-container')[0].scrollTop - this.dragOffset.y + 'px';

  }

  @HostListener('window:mouseup', ['$event'])
  handleMouseUp = (event : any) => {

    if (event.target.classList.contains('page-editor-slider-item')) {
      return;
    }

    this.resetDragging();
  }


  handleSeperatorClick = (index : number) => {

    // if (this.splitPoints.includes(index)) {
    //   this.splitPoints = this.splitPoints.filter(value => value !== index);
    //   this.splitPoints.sort();
    //   this.PDFWIZ && this.PDFWIZ.split(this.splitPoints);
    //   return;
    // }

    if (this.selectedSeperators.includes(index)) {
      this.selectedSeperators = this.selectedSeperators.filter(value => value !== index);
      this.selectedSeperators.sort();
      return;
    }
    this.selectedSeperators.push(index);
    this.selectedSeperators.sort();

  }

  handleSeperatorMouseUp = (event : any, index : number) => {

    if (this.draggedPage === null) {
      return;
    }

    if (index == this.draggedPage || index == this.draggedPage + 1) {
      return;
    }

    if (this.draggedPage == index) {
      this.resetDragging();
      return;
    }

    const tempPage = this.pages[this.draggedPage];
    const tempIndex = index > this.draggedPage ? index - 1 : index;
    this.pages.splice(this.draggedPage, 1);
    this.pages = [...this.pages.slice(0, tempIndex), tempPage, ...this.pages.slice(tempIndex)];

    this.PDFWIZ && this.PDFWIZ.movePage(this.draggedPage, tempIndex);
    
    this.resetDragging();

  }

  addType : string = 'index';

  handleAddClick = () => {

    this.addType = 'add';
    this.addFileInput?.nativeElement.click();

  }
  handleInsertClick = () => {

    if (this.selectedSeperators.length === 0) {
      return;
    }

    this.addType = 'insert';
    this.addFileInput?.nativeElement.click();

  }

  handleAddFileInputChange = (event : any) => {
    this.PDFInsert(event.target.files[0]);
  }
  PDFInsert = async (file : File) => {

    const pdf = await PDFJS.getDocument(await file.arrayBuffer()).promise;

    const tempPages = [];

    for (let i = 1; i < pdf.numPages + 1; i++) {
      const page = await pdf.getPage(i);

      const viewport = page.getViewport({ scale: .5 });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const renderContext : any = {
        canvasContext: ctx,
        viewport: viewport
      }
      
      await page.render(renderContext).promise;
      const result = canvas.toDataURL('image/jpeg', 1);

      tempPages.push(result);
    }

    if (this.addType == 'insert') {
      for (let i = this.selectedSeperators.length - 1; i >= 0; i--) {
        const index = this.selectedSeperators[i];
        this.pages.splice(index, 0, ...tempPages.map(url => new Page(url)));
      }
      
      this.PDFWIZ && this.PDFWIZ.insertPages(file, this.selectedSeperators).then(() => {
        this.updateSize();
      });
  
      this.numPages += this.selectedSeperators.length * tempPages.length;
      this.selectedSeperators = [];      
    }
    else if (this.addType == 'add') {
      this.pages.push(...tempPages.map(url => new Page(url)));
      this.numPages += tempPages.length;
    
      this.PDFWIZ && this.PDFWIZ.addPages(file).then(() => {
        this.updateSize();
      });
    }

    if (this.addFileInput) this.addFileInput!.nativeElement.value = '';

    if (!this.PDFWIZ) {
      return;
    }

  }


  extractOpen : boolean = false;

  extractedPDFs : any = [];

  handleExtractClick = () => {

    if ((this.getSelectedPages()).length === 0) {
      return;
    }

    this.extractOpen = !this.extractOpen;

  }
  sendExtract = (list : number []) => {
    this.PDFWIZ.saveSelection(list);
  }
  

  // handleSplitClick = () => {

  //   if (this.selectedSeperators.length === 0 || (this.selectedSeperators.length === 1 && this.selectedSeperators[0] === 0)) {
  //     return;
  //   }

  //   for (let i = 0; i < this.selectedSeperators.length; i++) {
  //     if (this.splitPoints.includes(this.selectedSeperators[i]) || this.selectedSeperators[i] === 0) {
  //       continue;
  //     }
  //     this.splitPoints.push(this.selectedSeperators[i]);
  //     this.splitPoints.sort();

  //     this.PDFWIZ.split(this.splitPoints);
  //   }
  //   this.selectedSeperators = [];

  // }
  
  splitOpen : boolean = false;

  handleSplitClick = () => {

    this.splitOpen = !this.splitOpen;

  }
  sendSplit = (list : number []) => {
    this.PDFWIZ.saveSelection(list);
  }

  handleRotateLeftClick = () => {

    if ((this.getSelectedPages()).length === 0) {
      return;
    }

    this.pages.forEach(page => page.rotateLeft());

    const selectedPagesIndexList : number [] = this.pages.map((page, index) => page.selected ? index : -1).filter((index) => index !== -1);
    this.PDFWIZ && this.PDFWIZ.rotateLeft(selectedPagesIndexList);

  }

  handleRotateRightClick = () => {

    if ((this.getSelectedPages()).length === 0) {
      return;
    }

    this.pages.forEach(page => page.rotateRight());

    const selectedPagesIndexList : number [] = this.pages.map((page, index) => page.selected ? index : -1).filter((index) => index !== -1);
    this.PDFWIZ && this.PDFWIZ.rotateRight(selectedPagesIndexList);

  }

  handleDeleteClick = () => {

    if ((this.getSelectedPages()).length === 0) {
      return;
    }

    const tempPages = this.pages.filter(page => !page.selected);

    const selectedPagesIndexList : number [] = this.pages.map((page, index) => page.selected ? index : -1).filter((index) => index !== -1);
    this.PDFWIZ && this.PDFWIZ.deletePages(selectedPagesIndexList).then(() => {
      this.updateSize();
    });

    this.numPages -= (this.numPages - tempPages.length);
    this.pages = tempPages;

  }

  handleSubmit = () => {
    this.submitCallback();
  }

}


class Page {

  url : string;
  selected : boolean = false;
  rotation : number = 0;

  constructor(url : string) {
    this.url = url;
  }

  rotateLeft = () => {

    if (!this.selected) {
      return;
    }
    this.rotation -= 90;

  }
  rotateRight = () => {

    if (!this.selected) {
      return;
    }
    this.rotation += 90;

  }

}

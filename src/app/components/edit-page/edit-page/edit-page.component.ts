import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as PDFJS from 'pdfjs-dist';
import { PDFWIZService } from 'src/app/services/pdfwiz.service';

import { getToolById, formatSize } from 'src/app/utils/utils';

@Component({
  selector: ' edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.scss']
})
export class EditPageComponent {

  constructor (
    private PDFWIZ : PDFWIZService,
    private router : Router
  ) {}

  formatSize = formatSize;
  getToolById = getToolById;

  size : number | null = null;

  ngOnInit() {
    if (this.PDFWIZ.PDFDoc === null) {
      this.router.navigate(['/home']);
      return;
    }

    const pdfWorkerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${ PDFJS.version }/pdf.worker.min.js`;
    PDFJS.GlobalWorkerOptions.workerSrc = pdfWorkerSrc;

    // console.log(this.location.getState())
    
    this.renderPDF();

    this.setSize();

  }


  pdf : any;
  numPages : number = 0;
  pages : any = [];
  pageWidths : number [] = [];

  
  renderPDF = async () => {

    if (!this.PDFWIZ) return;
    // console.log(await this.PDFWIZ.getSplitFile());

    // this.pdfBytes = await this.PDFWIZ.getFile();
    const pdf = await PDFJS.getDocument(await this.PDFWIZ.getFile()).promise;

    this.pdf = pdf;
    this.numPages = pdf.numPages;

    const devicePixelRatio = window.devicePixelRatio || 1;

    if (!pdf || !pdf.numPages) return;

    for (let i = 1; i < pdf.numPages + 1; i++) {
      const page = await pdf.getPage(i);

      const content = await this.extractContent(page);
      console.log(content);

      const viewport = page.getViewport({ scale: 1 });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: true });

      canvas.width = viewport.width * devicePixelRatio;
      canvas.height = viewport.height * devicePixelRatio;

      const transform = [ devicePixelRatio, 0 , 0, devicePixelRatio, 0, 0];

      const renderContext : any = {
        canvasContext: ctx,
        viewport: viewport,
        transform: transform
      }
      
      await page.render(renderContext).promise;
      const url = canvas.toDataURL('image/jpeg');

      const pageObject = new Page(url);
      pageObject.aspectRatio = viewport.width / 590;
      pageObject.content = content;
      pageObject.width = viewport.width;

      this.pages.push(pageObject);
    }

    // console.log(this.pages)
  }

  getName = () : string => {
    const name = this.PDFWIZ.getName();
    // return name.slice(0, name.lastIndexOf('.'));
    return name;
  }
  setSize = async () : Promise<void> => {
    this.size = await this.PDFWIZ.getSize();
  }


  async extractContent(page: any): Promise<any[]> {
    
    const viewport = page.getViewport({ scale: 1 });
    const content = await page.getTextContent();
  
    const styles = [];
  
    console.log(content)

    for (let i = 0; i < content.items.length; i++) {
      const item = content.items[i];
  
      const transform = viewport.transform;
  
      const left = item.transform[4];
      // const top = viewport.height - item.transform[5] - item.height / 2;
      // const top = viewport.height - item.transform[5];
      const bottom = item.transform[5]; 
  
      const fontStyles = content.styles[item.fontName];

      const style = {
        text: item.str,
        fontStyles: fontStyles,
        // font: item.fontName,
        // fontSize: item.fontSize,
        // fontWeight: item.fontWeight,
        // top: top,
        bottom,
        left,
        width: item.width,
        height: item.height,
        offset: item.transform[0]
      };
  
      styles.push(style);
    }
  
    return styles;
  }

  selectedEdit : number = 0;

  changeSelectedEdit = (index : number) => {
    this.selectedEdit = index;
  }


  selectedTool : number = 0;

  changeSelectedTool = (index : number) => {
    this.selectedTool = index;
  }


  // shapes = [{
  //   type: 'rect',
  //   x: 10,
  //   y: 10,
  //   width: 200,
  //   height: 200
  // }];

  @ViewChild('selector') selector : any;
  selecting : boolean = false;

  selectorLeft : number = 0;
  selectorTop : number = 0;
  selectorWidth : number = 0;
  selectorHeight : number = 0;

  startLeft : number = 0;
  startTop : number = 0;

  handleMouseDown = (event : any, index : number) => {

    this.startLeft = event.clientX - event.currentTarget.parentElement.offsetLeft;
    this.startTop = event.clientY - event.currentTarget.parentElement.offsetTop + event.currentTarget.parentElement.parentElement.scrollTop;
  
    this.selecting = true;
    this.selectorLeft = event.clientX;
    this.selectorTop = event.clientY;

  }
  handleMouseMove = (event : any, index : number) => {
    
    if (!this.selecting) return;
    
    this.selectorWidth = Math.abs(this.selectorLeft - event.clientX);
    this.selectorHeight = Math.abs(this.selectorTop - event.clientY);
    
  }
  handleMouseUp = (event : any, index : number) => {

    this.selecting = false;
    this.selectorLeft = 0;
    this.selectorTop = 0;
    this.selectorWidth = 0;
    this.selectorHeight = 0;

    const currLeft = event.clientX - event.currentTarget.parentElement.offsetLeft;
    const currTop = event.clientY - event.currentTarget.parentElement.offsetTop + event.currentTarget.parentElement.parentElement.scrollTop;

    
    // const ratio = this.pages[index].aspectRatio;
    console.log(event.currentTarget.width)
    const ratio = this.pages[index].width / event.currentTarget.width;

    const x = Math.min(this.startLeft, currLeft);
    const y = Math.min(this.startTop, currTop);
    const width = Math.abs(this.startLeft - currLeft);
    const height = Math.abs(this.startTop - currTop);

    this.pages[index].shapes.push({
      x: x,
      y: y,
      width: width,
      height: height
    });

    // this.PDFWIZ.drawRect(index, this.left * ratio, (event.currentTarget.height - this.top) * ratio, (left - this.left) * ratio, ((event.currentTarget.height - top) - (event.currentTarget.height - this.top)) * ratio);
    this.PDFWIZ.drawRect(index, {
      x: x * ratio,
      y: (event.currentTarget.height - y - height) * ratio,
      width: width * ratio,
      height: height * ratio
    });
    
    // this.PDFWIZ.drawRect(index, this.left, this.bottom, (left - this.left), (bottom - this.bottom));

    // this.pages = [];
    // this.numPages = 0;
    // this.renderPDF();
  }


  handleSubmit = () => {
    console.log('submit')
    this.router.navigate(['/review']);
  }


}



class Page {

  url : string;
  selected : boolean = false;
  rotation : number = 0;
  width : number = 0;
  aspectRatio : number = 1;
  content : any = [];
  shapes : any = [];

  // shapes : any = [{
  //   type: 'rect',
  //   x: 10,
  //   y: 10,
  //   width: 200,
  //   height: 200
  // }];

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

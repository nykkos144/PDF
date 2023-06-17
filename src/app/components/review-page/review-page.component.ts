import { Component } from '@angular/core';
import { Router } from '@angular/router';
import * as PDFJS from 'pdfjs-dist';
import { PDFWIZService } from 'src/app/services/pdfwiz.service';

import { getToolById, formatSize } from 'src/app/utils/utils';

@Component({
  selector: 'review-page',
  templateUrl: './review-page.component.html',
  styleUrls: ['./review-page.component.scss']
})
export class ReviewPageComponent {

  page = 'review';

  formatSize = formatSize;
  getToolById = getToolById;

  toolsList = ['compress', 'edit', 'protect', 'sign'];

  constructor(
    private PDFWIZ : PDFWIZService,
    private router : Router
  ) {}

  originalSize : number | null = null;
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

    this.setOriginalSize();
    this.setSize();
    
    // this.calculatePageWidth();
    // console.log(this.PDFWIZ.getFile())
  }


  pdf : any;
  numPages : number = 0;
  pages : any = [];
  pageWidths : number [] = [];

  renderPDF = async () => {

    // console.log(await this.PDFWIZ.getSplitFile());

    // this.pdfBytes = await this.PDFWIZ.getFile();
    const pdf = await PDFJS.getDocument(await this.PDFWIZ.getFile()).promise;

    this.pdf = pdf;
    this.numPages = pdf.numPages;

    const devicePixelRatio = window.devicePixelRatio || 1;

    if (!pdf || !pdf.numPages) return;

    for (let i = 1; i < pdf.numPages + 1; i++) {
      const page = await pdf.getPage(i);

      const viewport = page.getViewport({ scale: 1 });
      // const viewport = page.getViewport({ scale: tempViewport.width < 500 ? 1.5 : 1 });

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

      this.pageWidths?.push(viewport.width * window.devicePixelRatio);
      this.pages.push(url);
    }

    // console.log(this.pages)
  }

  getName = () : string => {
    const name = this.PDFWIZ.getName();
    return name.slice(0, name.lastIndexOf('.'));
  }
  setOriginalSize = () : void => {
    this.originalSize = this.PDFWIZ.originalSize;
    // return this.PDFWIZ.originalSize || 0;
  }
  setSize = async () : Promise<void> => {
    this.size = await this.PDFWIZ.getSize();
  }

  calculatePageWidth = (index : number) => {
    const biggestPage = Math.max(...this.pageWidths);
    return (this.pageWidths[index] / biggestPage) * 100;
    // return (this.pageWidths[index] / 520) * 100;
  }


  handleSave = () => {
    this.PDFWIZ.save();
  }


}
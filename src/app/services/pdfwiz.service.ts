import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';

// import { PDFDocument, degrees } from "pdf-lib";

const { PDFDocument, degrees, grayscale, rgb } = require('pdf-lib');
import * as PDFJS from 'pdfjs-dist';

import { isListIncremental } from '../utils/utils';


@Injectable({
  providedIn: 'root'
})
export class PDFWIZService {

  constructor(
    private electronService: ElectronService
  ) {}

  ngOnInit() {
    // const pdfWorkerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${ PDFJS.version }/pdf.worker.min.js`;
    // PDFJS.GlobalWorkerOptions.workerSrc = pdfWorkerSrc;
  }

  file : File | null = null;
  PDFDoc : any | null = null;

  originalSize : number | null = null;

  splitPoints : number [] = [];

  restart = () : void => {
    console.log('PDFWIZ restarted')
  }

  setFile = async (file : any) : Promise<void> => {

    this.file = file;
    this.PDFDoc = await PDFDocument.load(await file.arrayBuffer());
    this.originalSize = await this.getSize();

  }
  getFile = async () : Promise<Uint8Array> => {
    return await this.PDFDoc.save()
  }
  getSourceFile = () : File | null => {
    return this.file;
  }
  
  // getSplitFile = async () : Promise<Uint8Array []> => {

  //   const splitPDF : any = [];

  //   const splicedSplitPoints = this.splitPoints.filter(val => val <= this.PDFDoc.getPageCount());

  //   console.log(splicedSplitPoints)

  //   const files : any = [];

  //   for (let i = 0; i <= splicedSplitPoints.length; i++) {

  //     const from = i > 0 ? splicedSplitPoints[i - 1] : 0;
  //     const to = i == splicedSplitPoints.length ? this.PDFDoc.getPageCount() : splicedSplitPoints[i];

  //     const pageIndexes = Array.from({ length: to - from }, (_, x) => x + from);

  //     console.log(pageIndexes)

  //     const doc = await PDFDocument.create();
  //     const pages = await doc.copyPages(this.PDFDoc, pageIndexes);
  //     pages.forEach((page : any) => doc.addPage(page));
  //     files.push({
  //         name: this.getSplitFileName(pageIndexes),
  //         url: await doc.save()
  //     });
  //   }

  //   return files;

  // }
  // getSplitFileName = (list : any) => {
  //   const name = this.getName();
  //   const nameNoExtension = name.slice(0, name.lastIndexOf('.'));
  //   return `${ nameNoExtension }_${ list.length == 1 ? list[0] + 1 : !isListIncremental(list) ? list.map((num : number) => num + 1).join(', ') : (list[0] + 1) + '-' + (list[list.length - 1] + 1) }.pdf`
  // }



  getSize = async () : Promise<number> => {

    const pdfBytes = await this.PDFDoc.save();
    const fileSize = pdfBytes.length;

    return fileSize;

  }
  getName = () : string => {
    return this.file?.name || 'File';
  }


  //
  ////////// PAGE MANIPULATION //////////
  //

  movePage = (fromIndex : number, toIndex : number) : void => {

    if (!this.PDFDoc) {
        return;
    }
    
    const page = this.PDFDoc.getPages()[fromIndex];

    this.PDFDoc.removePage(fromIndex);
    this.PDFDoc.insertPage(toIndex, page);

  }

  switchPages = (fromIndex : number, toIndex : number) : void => {

    if (!this.PDFDoc) {
        return;
    }
    
    const page1 = this.PDFDoc.getPages()[fromIndex];
    const page2 = this.PDFDoc.getPages()[toIndex];

    this.PDFDoc.removePage(fromIndex);
    this.PDFDoc.removePage(toIndex);

    if (fromIndex < toIndex) {
        this.PDFDoc.insertPage(fromIndex, page2);
        this.PDFDoc.insertPage(toIndex, page1);
    }
    else {
        this.PDFDoc.insertPage(toIndex, page1);
        this.PDFDoc.insertPage(fromIndex, page2);
    }

  }

  addPages = async (file : File) : Promise<void> => {

    const pdf = await PDFDocument.load(await file.arrayBuffer());;

    const pages = await this.PDFDoc.copyPages(pdf, pdf.getPageIndices());

    pages.forEach((page : any) => this.PDFDoc.addPage(page));

  }

  insertPages = async (file : File, indexList : number []) : Promise<void> => {

    const pdf = await PDFDocument.load(await file.arrayBuffer());;

    for (let i = indexList.length - 1; i >= 0; i--) {
      const pages = await this.PDFDoc.copyPages(pdf, pdf.getPageIndices());

      for (let j = 0; j < pdf.getPageCount(); j++) {
        this.PDFDoc.insertPage(indexList[i] + j, pages[j]);
      }
    }

  }

  deletePages = async (indexList : number []) : Promise<void> => {

    const modifiedDoc = await PDFDocument.create();

    const indexes = Array.from({ length: this.PDFDoc.getPageCount() }, (_, index) => index);
    const filtered = indexes.filter(num => !indexList.includes(num));

    const pages = await modifiedDoc.copyPages(this.PDFDoc, filtered);

    pages.forEach((page : any) => modifiedDoc.addPage(page));

    this.PDFDoc = modifiedDoc;

  }
  
  rotateLeft = (indexList : number []) : void => {

    for (let index of indexList) {
      const page = this.PDFDoc.getPages()[index];
      page.setRotation(degrees(page.getRotation().angle - 90));
    }

  }

  rotateRight = (indexList : number []) : void => {

    for (let index of indexList) {
      const page = this.PDFDoc.getPages()[index];
      page.setRotation(degrees(page.getRotation().angle + 90));
    }

  }

  // split = (indexList : number []) : void => {
  //   this.splitPoints = indexList;
  // }

  // split = async (indexList : any) : Promise<void> => {

  //   if (!this.electronService) {
  //     return;
  //   }

  //   const files : any = [];

  //   for (let pdf of indexList) {
  //     const doc = await PDFDocument.create();
  //     const pages = await doc.copyPages(this.PDFDoc, pdf.pages);
  //     pages.forEach((page : any) => doc.addPage(page));
  //     files.push({
  //         name: pdf.name,
  //         url: await doc.save()
  //     });
  //   }

  //   if (!this.electronService.ipcRenderer) {
  //     return;
  //   }

  //   this.electronService.ipcRenderer.send('save-file', {
  //     // fileName: this.file ? this.file.name : 'gay-shit.pdf',
  //     files: files
  //   });
  // }

  // extract = async (indexList : any) : Promise<void> => {

  //   if (!this.electronService) {
  //     return;
  //   }

  //   const files : any = [];

  //   for (let pdf of indexList) {
  //     const doc = await PDFDocument.create();
  //     const pages = await doc.copyPages(this.PDFDoc, pdf.pages);
  //     pages.forEach((page : any) => doc.addPage(page));
  //     files.push({
  //         name: pdf.name,
  //         url: await doc.save()
  //     });
  //   }

  //   if (!this.electronService.ipcRenderer) {
  //     return;
  //   }

  //   this.electronService.ipcRenderer.send('save-file', {
  //     // fileName: this.file ? this.file.name : 'gay-shit.pdf',
  //     files: files
  //   });
  // }

  saveSelection = async (indexList : any) : Promise<void> => {

    if (!this.electronService) {
      return;
    }

    const files : any = [];

    for (let pdf of indexList) {
      const doc = await PDFDocument.create();
      const pages = await doc.copyPages(this.PDFDoc, pdf.pages);
      pages.forEach((page : any) => doc.addPage(page));
      files.push({
          name: pdf.name,
          url: await doc.save()
      });
    }

    if (!this.electronService.ipcRenderer) {
      return;
    }

    this.electronService.ipcRenderer.send('save-file', {
      files: files
    });
  }

  save = async () => {

    if (!this.electronService) {
      return;
    }

    this.electronService.ipcRenderer.send('save-file', {
      files: [{
        name: this.file?.name,
        url: await this.PDFDoc.save()
      }]
    });
  }

  //
  ////////// PAGE MANIPULATION //////////
  //


  compressPDF = async (compressionLevel : number) => {

    const doc = await PDFDocument.create();
    const pages = await doc.copyPages(this.PDFDoc, this.PDFDoc.getPageIndices());
    // pages.forEach((page : any) => doc.addPage(page));

    pages.forEach((page : any) => {
      const copiedPage = doc.addPage(page);
      
      // Copy necessary objects from the original page
      const copiedObjects = new Set();
      
      // page.getObjects().forEach((object : any) => {
      //   if (!copiedObjects.has(object)) {
      //     copiedPage.addFontDictionary(object);
      //     copiedPage.addNode(object);
      //     copiedObjects.add(object);
      //   }
      // });

      const imageQuality = 1 - compressionLevel;

      // page.getImages().forEach(async (image : any) => {
      //   const existingImage = await image.asImage();
      //   const newImage = await this.PDFDoc.embedPng(existingImage.clone().scale(imageQuality));
      //   image.setImage(newImage);
      // });
    });

    this.PDFDoc = doc;
    // const modifiedPdfBytes = await this.PDFDoc.save();
  }




  ////////////////////////// EDIT ///////////////////////////////

  // drawRect = (pageIndex : number, x : number, y : number, width : number, height : number) => {
  //   console.log(x, y, width, height)
  //   const page = this.PDFDoc.getPage(pageIndex);
  //   page.drawRectangle({
  //     x: x,
  //     y: y + 2,
  //     width: width + 2,
  //     height: height + 2,
  //     rotate: degrees(0),
  //     borderWidth: 0,
  //     borderColor: grayscale(1),
  //     color: rgb(0.75, 0.2, 0.2),
  //     opacity: .5,
  //     borderOpacity: 1,
  //   })
  // }

  drawRect = (pageIndex : number, { x, y, width, height } : any) => {
    
    // const x, y, width, height = data.map()

    console.log(x, y, width, height)
    const page = this.PDFDoc.getPage(pageIndex);
    page.drawRectangle({
      x: x - 1,
      y: y + 1,
      width: width,
      height: height,
      rotate: degrees(0),
      borderWidth: 0,
      borderColor: grayscale(1),
      color: rgb(0.75, 0.2, 0.2),
      opacity: .5,
      borderOpacity: 1,
    });

  }
}


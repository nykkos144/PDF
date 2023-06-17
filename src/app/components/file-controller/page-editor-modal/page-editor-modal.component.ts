import { Component, Input } from '@angular/core';

@Component({
  selector: 'page-editor-modal',
  templateUrl: './page-editor-modal.component.html',
  styleUrls: ['./page-editor-modal.component.scss']
})
export class PageEditorModalComponent {

  @Input() type : string = '';
  @Input() file : File | null = null;

  @Input() selectedPages : number [] = [];
  @Input() selectedSeperators : number [] = [];
  @Input() pageCount : number= 0;

  @Input() closeCallback = () : void => {};
  @Input() submitCallback = (resultList : number []) : void => {};

  filterOpen : boolean = false;
  selectedFilter : number = 0;

  resultList : any = [];

  ngOnInit() {
    this.update();
    this.filterOpen = false;
    this.selectedFilter = 0;

    this.selectedSeperators = this.selectedSeperators.filter((num : number) => num !== 0);
  }

  handleFilterClick = () => {
    this.filterOpen = !this.filterOpen;
  }
  handleFilterSelect = (number : number) => {
    this.selectedFilter = number;
    this.filterOpen = false;
    this.update();
  }

  update = () => {
    if (this.type == 'extract') {
      this.updateExtract();
    }
    else if (this.type == 'split') {
      this.updateSplit();
    }
  }

  updateExtract = () => {

    this.resultList = [];

    if (!this.selectedPages || !this.selectedSeperators) return;

    if (this.selectedFilter == 0) {
      this.resultList.push({ name: this.getFileName(this.selectedPages), pages: this.selectedPages });
    }
    else if (this.selectedFilter == 1) {
      this.resultList = this.selectedPages.map(page => { return { name: this.getFileName([page]), pages: [page] }});
    }
    else if (this.selectedFilter == 2) {

      if (this.selectedSeperators.length == 0) return;

      const splicedSplitPoints = this.selectedSeperators.filter(val => val > this.selectedPages[0] && val <= this.selectedPages[this.selectedPages.length - 1]);

      if (this.selectedSeperators.length == 0 || splicedSplitPoints.length == 0) {
        this.resultList.push({ name: this.getFileName(this.selectedPages), pages: this.selectedPages });
        return;
      }

      let currPage = 0;
      let currSplit = 0;
      
      let temp : any = [];

      while (currPage < this.selectedPages.length) {

        if (!splicedSplitPoints[currSplit] || this.selectedPages[currPage] < splicedSplitPoints[currSplit]) {
          temp.push(this.selectedPages[currPage]);
        }
        else {
          if (temp.length > 0) {
            this.resultList.push({name: this.getFileName(temp), pages: temp});
            temp = [];
          }
          currSplit++;
          continue;
        }

        currPage++;
      }

      this.resultList.push({name: this.getFileName(temp), pages: temp});

    }

  }

  updateSplit = () => {

    this.resultList = [];

    const pages = Array.from({ length: this.pageCount }, (_, index) => index);

    if (this.selectedFilter == 0) {
      this.resultList = pages.map(page => { return { name: this.getFileName([page]), pages: [page] }});
    }
    else if (this.selectedFilter == 1) {

      for (let i = 0; i <= this.selectedSeperators.length; i++) {
        
        const from = i > 0 ? this.selectedSeperators[i - 1] : 0;
        const to = i == this.selectedSeperators.length ? this.pageCount : this.selectedSeperators[i];

        const pageIndexes = Array.from({ length: to - from }, (_, x) => x + from);

        this.resultList.push({name: this.getFileName(pageIndexes), pages: pageIndexes})

      }

    }

  }


  getModifiedExtracted = (list : number []) : number [] => {
    return list.map(num => num + 1);
  }
  isListIncremental(list: number[]): boolean {

    for (let i = 0; i < list.length - 1; i++) {
      if (list[i] + 1 !== list[i + 1]) {
        return false;
      }
    }
    return true;

  }
  
  getFileName = (list : any) : string | undefined => {

    if (!this.file || !list) return;

    // return `${ this.file.name.split(".")[0] }_${ list.length == 1 ? list[0] + 1 : !this.isListIncremental(list) ? this.getModifiedExtracted(list).join(', ') : (list[0] + 1) + '-' + (list[list.length - 1] + 1) }.pdf`
    return `${ this.getFileNameWithoutExtension(this.file.name) }_${ list.length == 1 ? list[0] + 1 : !this.isListIncremental(list) ? this.getModifiedExtracted(list).join(', ') : (list[0] + 1) + '-' + (list[list.length - 1] + 1) }.pdf`
  
  }
  getFileNameWithoutExtension = (fileName : string) : string => {

    const lastDotIndex = fileName.lastIndexOf('.');
    if (lastDotIndex === -1) {
      return fileName;
    } else {
      return fileName.substring(0, lastDotIndex);
    }

  }

}

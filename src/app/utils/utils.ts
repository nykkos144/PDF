import { tools } from "../constants/tools";
import ToolInterface from "../interfaces/tool.interface";

export const formatSize = (sizeInBytes : number) : string => {

    const units = ['B', 'KB', 'MB', 'GB'];
    let size = sizeInBytes;
    let unitIndex = 0;
  
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
  
    return `${ size.toFixed(2) } ${ units[unitIndex] }`;
}


export const getToolById = (id : string) : ToolInterface | undefined => {
    return tools.find(tool => tool.id === id);
}

export const formatType = (name : string) : string => {

  const extension = name.split('.').pop();

  if (extension === 'pdf') {
    return 'PDF';
  }
  else if (extension === 'doc' || extension === 'docx') {
    return 'WORD';
  }
  else if (extension === 'xls' || extension === 'xlsx') {
    return 'EXCEL';
  }
  else if (extension === 'ppt' || extension === 'pptx') {
    return 'POWERPOINT';
  }
  else if (extension === 'jpg' || extension === 'jpeg' || extension === 'png') {
    return 'IMAGE';
  }

  return 'OTHER';
}


export const isListIncremental = (list: number[]): boolean => {

  for (let i = 0; i < list.length - 1; i++) {
    if (list[i] + 1 !== list[i + 1]) {
      return false;
    }
  }
  return true;

}
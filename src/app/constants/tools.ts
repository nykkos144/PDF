import ToolInterface from "../interfaces/tool.interface";

export const tools : ToolInterface [] = [
    {
        id: 'pdf-to-word',
        name: 'PDF to Word',
        image: 'assets/icons/word-file.svg',
        description: 'Convert your PDFs to editable Word documents. Preserve the layout, fonts, and formatting of your original PDF. Extract text and images from your PDFs. Convert multiple PDFs to Word in batch mode.',
        allowedFiles: '.pdf',
        color: '#3D99F5',
        route: null,
        options: [
            {
                name: 'Without OCR',
                description: 'Only selectable text in your PDFs will be converted to editable Word format. Text in images or scans won’t be converted.',
                image: null,
                extraData: null
            },
            {
                name: 'With OCR',
                description: 'All text in your PDFs, including text in scans and images, will be converted to editable Word format.',
                image: null,
                extraData: null
            }
        ]
    },
    {
        id: 'pdf-to-excel',
        name: 'PDF to Excel',
        image: 'assets/icons/excel-file.svg',
        description: 'Convert your PDFs to editable Excel spreadsheets. Preserve the layout, fonts, and formatting of your original PDF. Extract tables and data from your PDFs. Convert multiple PDFs to Excel in batch mode.',
        allowedFiles: '.pdf',
        color: '#00CC44',
        route: null,
        options: [
            {
                name: 'Without OCR',
                description: 'Only selectable text in your PDFs will be converted to editable Word format. Text in images or scans won’t be converted.',
                image: null,
                extraData: null
            },
            {
                name: 'With OCR',
                description: 'All text in your PDFs, including text in scans and images, will be converted to editable Word format.',
                image: null,
                extraData: null
            }
        ]
    },
    {
        id: 'pdf-to-ppt',
        name: 'PDF to PPT',
        image: 'assets/icons/powerpoint-file.svg',
        description: 'Convert your PDFs to editable PowerPoint presentations. Preserve the layout, fonts, and formatting of your original PDF. Extract text and images from your PDFs. Convert multiple PDFs to PowerPoint in batch mode.',
        allowedFiles: '.pdf',
        color: '#C43F1D',
        route: {
            type : 'route',
            component: 'review'
        },
        options: null
    },
    {
        id: 'pdf-to-jpeg',
        name: 'PDF to JPEG',
        image: 'assets/icons/jpeg-file.svg',
        description: 'Convert your PDFs to high-quality JPEG images. Preserve the layout, fonts, and formatting of your original PDF. Extract images and graphics from your PDFs. Convert multiple PDFs to JPEG in batch mode.',
        allowedFiles: '.pdf',
        color: '#FFFF33',
        route: {
            type : 'route',
            component: 'review'
        },
        options: null
    },
    {
        id: 'pdf-converter',
        name: 'PDF Converter',
        image: 'assets/icons/convert.svg',
        description: 'Convert your PDFs to various file formats, including Word, PPT, Excel, JPEG, and more. Preserve the layout, fonts, and formatting of your original PDF. Convert multiple PDFs to different formats in batch mode.',
        allowedFiles: '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png',
        color: '#FF8000',
        route: null,
        options: [
            {
                name: 'to Word',
                description: '.docx',
                image: 'assets/icons/word-file-big.svg',
                extraData: null
            },
            {
                name: 'to Excel',
                description: '.xlsx',
                image: 'assets/icons/excel-file-big.svg',
                extraData: null
            },
            {
                name: 'to Powerpoint',
                description: '.pptx',
                image: 'assets/icons/ppt-file-big.svg',
                extraData: null
            },
            {
                name: 'to JPEG',
                description: '.jpeg',
                image: 'assets/icons/jpeg-file-big.svg',
                extraData: null
            }
        ]
    },
    {
        id: 'edit',
        name: 'Edit PDF',
        image: 'assets/icons/edit.svg',
        description: 'Edit your PDFs online. Add text, images, and shapes. Highlight and underline text. Draw and annotate on your PDFs. Add fillable forms and digital signatures. Save and download your edited PDFs.',
        allowedFiles: '.pdf',
        color: '#0FC0C5',
        route: {
            type : 'route',
            component: 'edit'
        },
        options: null
    },
    {
        id: 'reorder-pages',
        name: 'Reorder pages',
        image: 'assets/icons/reorder-pages.svg',
        description: 'Reorder the pages in your PDFs. Rearrange them by dragging and dropping. Delete and insert pages. Merge and split PDF pages. Save and download your reordered PDFs.',
        allowedFiles: '.pdf',
        color: '#0FC0C5',
        route: {
            type : 'open',
            component: 'page-select'
        },
        options: null
    },
    {
        id: 'delete-pages',
        name: 'Delete pages',
        image: 'assets/icons/delete.svg',
        description: 'Delete pages from your PDFs. Select the pages you want to remove. Rearrange the remaining pages. Save and download your modified PDFs.',
        allowedFiles: '.pdf',
        color: '#0FC0C5',
        route: {
            type : 'open',
            component: 'page-select'
        },
        options: null
    },
    {
        id: 'split',
        name: 'Split PDF',
        image: 'assets/icons/split.svg',
        description: 'Splitting PDF files into individual pages or extracting specific pages to create a new PDF document is made easy with this tool, without the need for installing any additional software.',
        allowedFiles: '.pdf',
        color: '#0FC0C5',
        route: {
            type : 'open',
            component: 'page-edit'
        },
        options: null
    },
    {
        id: 'number-pages',
        name: 'Number pages',
        image: 'assets/icons/number-pages.svg',
        description: 'This tool allows you to add page numbers to your PDF documents quickly and effortlessly, with the flexibility to customize the position, format, and style of the page numbers to suit your preferences.',
        allowedFiles: '.pdf',
        color: '#0FC0C5',
        route: null,
        options: null
    },
    {
        id: 'sign',
        name: 'Sign PDF',
        image: 'assets/icons/sign.svg',
        description: 'This tool offers a quick and convenient solution for signing PDF documents, allowing you to effortlessly draw or upload your signature and add it to your PDF file.',
        allowedFiles: '.pdf',
        color: '#7961F2',
        route: {
            type: 'route',
            component: 'sign'
        },
        options: null
    },
    {
        id: 'protect',
        name: 'Protect PDF',
        image: 'assets/icons/protect.svg',
        description: 'Protect your PDF files with a password to prevent unauthorized access. Set permissions to control what others can do with your PDF file.',
        allowedFiles: '.pdf',
        color: '#3D99F5',
        route: null,
        options: null
    },
    {
        id: 'unlock',
        name: 'Unlock PDF',
        image: 'assets/icons/unlock.svg',
        description: 'This tool enables you to effortlessly remove password protection and restrictions from your PDF files, so you can access and edit their content without any limitations.',
        allowedFiles: '.pdf',
        color: '#FF5975',
        route: {
            type: 'route',
            component: 'review'
        },
        options: null
    },
    {
        id: 'compress',
        name: 'Compress PDF',
        image: 'assets/icons/compress.svg',
        allowedFiles: '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.tiff',
        description: 'Reduce the size of your PDF files without losing quality. Compress more than just PDFs. Use the tool to reduce other file types, such as Word, PPT, Excel, JPG, PNG, GIF, and TIFF. Reduce file size up to 99%.',
        // color: '#FF0000',
        color: '#F23030',
        route: null,
        options: [
            {
                name: 'Basic compresion',
                description: 'Medium file size, high quality',
                image: 'assets/icons/pdf-file-big.svg',
                extraData: {
                    compressionLevel: .4
                }
            },
            {
                name: 'Strong compresion',
                description: 'Smallest file size, good quality',
                image: 'assets/icons/pdf-file-big.svg',
                extraData: {
                    compressionLevel: .7
                }
            }
        ]
    },
    {
        id: 'merge',
        name: 'Merge PDF',
        image: 'assets/icons/merge.svg',
        description: 'Merge multiple PDF files into a single PDF document. Arrange the files in the order you want them to appear in the merged document.',
        allowedFiles: '.pdf',
        color: '#FFFF33',
        route: {
            type: 'open',
            component: 'page-edit'
        },
        options: null
    }
]
import Preview from '../preview';
import UploadIcon from '@mui/icons-material/Upload';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import { width } from '@mui/system';
import {
  PDFDict,
  PDFDocument,
  PDFHexString,
  PDFName,
  PDFObject,
} from 'pdf-lib';
import { ChangeEvent, useState } from 'react';

type Book = {
  title: string | undefined;
  author: string | undefined;
  subject: string | undefined;
  keywords: string | undefined;
  pageCount: number | undefined;
  firstPageBytes: Uint8Array;
  outlines: Outline[];
};

type Outline = {
  level: number;
  title: string;
  destObj: PDFObject | undefined;
  actionObj: PDFObject | undefined;
  seObj: PDFObject | undefined;
};
function get_outlines(
  doc: PDFDocument,
  obj: PDFObject | undefined,
  level: number,
  outlines: Outline[]
) {
  if (obj instanceof PDFDict) {
    const firstObj = obj.get(PDFName.of('First'));
    const lastObj = obj.get(PDFName.of('Last'));
    const nextObj = obj.get(PDFName.of('Next'));
    const titleObj = obj.get(PDFName.of('Title'));
    if (titleObj) {
      const actionObj = obj.get(PDFName.of('A'));
      const destObj = obj.get(PDFName.of('Dest'));
      if (actionObj || destObj) {
        const title = (titleObj as PDFHexString).decodeText();
        const seObj = obj.get(PDFName.of('SE'));
        outlines.push({ level, title, destObj, actionObj, seObj });
      }
    }

    if (firstObj && lastObj) {
      get_outlines(doc, doc.context.lookup(firstObj), level + 1, outlines);
    }
    if (nextObj) {
      get_outlines(doc, doc.context.lookup(nextObj), level, outlines);
    }
  }
}

function range(start, end) {
  let length = end - start + 1;
  return Array.from({ length }, (_, i) => start + i - 1);
}

async function extractPdfPage(pdfSrcDoc: PDFDocument) {
  const pdfNewDoc = await PDFDocument.create();
  const pages = await pdfNewDoc.copyPages(pdfSrcDoc, range(1, 1));
  pages.forEach((page) => {
    page.scale(0.2, 0.2);
    pdfNewDoc.addPage(page);
  });
  const newpdf = await pdfNewDoc.save();
  return newpdf;
}

function outlineToMarkdown(outlines: Outline[]): string {
  let result = '';

  for (const outline of outlines) {
    const line = ' '.repeat(5 * (outline.level - 1)) + '1. ' + outline.title;
    result += line;
    result += '\n';
  }
  return result;
}
export default function BookUploader() {
  const [book, setBook] = useState<Book | null>(null);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const { name, files } = event.target;

    const file = files?.[0];
    if (file) {
      const buffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer, {
        updateMetadata: false,
      });

      // Print all available metadata fields
      console.log('Title:', pdfDoc.getTitle());
      console.log('Author:', pdfDoc.getAuthor());
      console.log('Subject:', pdfDoc.getSubject());
      console.log('Creator:', pdfDoc.getCreator());
      console.log('Keywords:', pdfDoc.getKeywords());
      console.log('Producer:', pdfDoc.getProducer());
      console.log('Creation Date:', pdfDoc.getCreationDate());
      console.log('Modification Date:', pdfDoc.getModificationDate());
      console.log('PageCount:', pdfDoc.getPageCount());
      console.log('isEncrypted:', pdfDoc.isEncrypted);
      const obj = pdfDoc.catalog.lookup(PDFName.of('Outlines'));
      const outlines: Outline[] = [];
      get_outlines(pdfDoc, obj, 0, outlines);
      setBook({
        title: pdfDoc.getTitle(),
        author: pdfDoc.getAuthor(),
        subject: pdfDoc.getSubject(),
        keywords: pdfDoc.getKeywords(),
        pageCount: pdfDoc.getPageCount(),
        firstPageBytes: await extractPdfPage(pdfDoc),
        outlines: outlines,
      });

      handleClickOpen();
    }
  };
  return (
    <>
      <IconButton size='medium' aria-label='upload picture' component='label'>
        <input
          hidden
          type='file'
          onChange={handleFileChange}
          style={{ width: '100vw', height: '100vh' }}
        />
        <UploadIcon />
      </IconButton>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Register</DialogTitle>

        <DialogContent>
          <Box component='form' m={2}>
            <Typography>Image</Typography>

            <iframe
              src={URL.createObjectURL(
                new Blob([book?.firstPageBytes ?? ''], {
                  type: 'application/pdf',
                })
              )}
              style={{ height: 150, width: 125 }}
            />

            <TextField
              id='title'
              label='Title'
              fullWidth
              value={book?.title}
              variant='standard'
            />
            <TextField
              id='author'
              label='Author'
              fullWidth
              value={book?.author}
              variant='standard'
            />
            <TextField
              id='pageCount'
              label='Page Count'
              fullWidth
              value={book?.pageCount}
              variant='standard'
            />
            <Typography>Table of contents</Typography>
            <Preview content={outlineToMarkdown(book?.outlines ?? [])} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Register</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

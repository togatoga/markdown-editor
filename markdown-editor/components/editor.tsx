import Preview from './preview';
import { Divider, Grid, Typography } from '@mui/material';
import '@uiw/react-markdown-preview/markdown.css';
import '@uiw/react-md-editor/markdown-editor.css';
import dynamic from 'next/dynamic';
import { useState } from 'react';

const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
);

export default function MyEditor() {
  const [value, setValue] = useState<string>('');
  function handleEditorChange(value: string | undefined) {
    setValue(value ?? '');
  }

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Preview content={value} />
        </Grid>
        <Grid item xs={6}>
          <Typography>Markdown</Typography>
          <Divider />
          <div data-color-mode='light'>
            <div className='wmde-markdown-var' />
            <MDEditor
              value={value}
              hideToolbar={true}
              preview='edit'
              commands={[]}
              previewOptions={{}}
              extraCommands={[]}
              textareaProps={{
                placeholder: 'Please enter Markdown text',
              }}
              height={1000}
              onChange={handleEditorChange}
            />
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

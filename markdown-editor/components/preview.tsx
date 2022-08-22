import { Divider, Typography } from '@mui/material';
import { useEffect } from 'react';
import 'zenn-content-css';
import markdownToHtml from 'zenn-markdown-html';

function Preview(props: { content: string }) {
  const { content } = props;
  useEffect(() => {
    import('zenn-embed-elements');
  }, []);
  return (
    <>
      <Typography>Preview</Typography>
      <Divider />
      <div className='znc'>
        <span dangerouslySetInnerHTML={{ __html: markdownToHtml(content) }} />
      </div>
    </>
  );
}

export default Preview;

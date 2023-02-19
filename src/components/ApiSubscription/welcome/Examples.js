import { useState } from 'react';
import { Box, capitalize, Divider } from '@mui/material';
import WhiteCard from 'components/MarketAnalysis/graphs/WhiteCard';
import { codeExamples } from '../data/code-examples';
import { CopyBlock, monokai } from 'react-code-blocks';

const Examples = () => {
  const [tab, setTab] = useState('trending-collections');
  const codeExample = codeExamples.find((code) => code.label === tab);

  return (
    <WhiteCard sx={{ width: 'auto', height: 'fit-content' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', rowGap: 1 }}>
        <Box
          sx={{
            display: 'flex',
            // columnGap: 1,
            mt: 2,
          }}
        >
          {codeExamples.map((code, index) => (
            <Box sx={{ display: 'flex' }}>
              <Box key={code.label}>
                <span
                  style={{
                    color:
                      tab === code.label
                        ? 'var(--logoColor)'
                        : 'var(--fontColor)',
                    textDecoration: tab === code.label && 'underline',
                    textDecorationColor:
                      tab === code.label
                        ? 'var(--logoColor)'
                        : 'var(--fontColor)',
                    cursor: 'pointer',
                  }}
                  onClick={() => setTab(code.label)}
                >
                  {capitalize(code.name)}
                </span>
              </Box>
              {codeExamples.length - 1 !== index && (
                <Divider
                  sx={{ height: 15, mx: 1.5, my: 'auto' }}
                  orientation="vertical"
                />
              )}
            </Box>
          ))}
        </Box>
        <Divider sx={{ width: '100%', mx: 'auto', my: 1 }} />
        <CopyBlock
          text={
            `# Get ${codeExample.name}\n` +
            JSON.stringify(codeExample.sampleResponse, null, 4)
          }
          language="json"
          wrapLines
          // theme="dracula"
          theme={monokai}
          codeBlock
          showLineNumbers={false}
        />
      </Box>
    </WhiteCard>
  );
};

export default Examples;

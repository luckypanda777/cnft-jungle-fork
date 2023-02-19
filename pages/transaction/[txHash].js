import { Box } from '@mui/material';
import Transaction from 'components/Transaction/Transaction';
import moment from 'moment';
import { NextSeo } from 'next-seo';
import styles from '../../styles/Markets.module.scss';

const SEO = {
  title: 'CNFT Jungle - Your Readable NFT Transaction',
  description:
    'Finally understand what the transaction means and what is going on',
};

export async function getServerSideProps(ctx) {
  const { txHash } = ctx.params;

  let data = null;

  const params = {
    page: 1,
    perPage: 0,
    sort: 'assetNumber',
    sortDirection: 'asc',
    traitFilterLogic: 'intersection',
  };

  try {
    // const resp = await axios.get(`${API_URL}/transactions/${transaction}`, {
    //   params,
    //   headers,
    // });
    // data = resp.data;
  } catch (e) {
    console.error(e);
  }

  return {
    props: {
      transaction: {
        txHash,
        created_at: Date.now(),

        inputs: [
          {
            from: 'addr1qxp4ggttyqz3k2gkme9r7gqyp4gzjyvfjqqreqpfpp5dtp705rp4xesducet64d5ql6m053pkxe6cmhrk5jl6zvr23eqcsuck8',
            assets: new Array(Math.floor(Math.random() * 5 + 1)).fill({
              initialPrice: parseInt(Math.random() * 100),
              currentPrice: parseInt(Math.random() * 200),
              name: 'Big Kong',
              image:
                'https://image-optimizer.jpgstoreapis.com/QmPGJbXjsJgUDotcAiosu6Gspo84u3FkzAS3FaKmfctZJA?width=1200',
              date: moment().format('DD MM YYYY:HH:mm:ss UTC'),
              fromAddress:
                'addr1qy0cqs09v6ffegzc3za5nk52w45jaqynna66a3pew0h3z5t8v69l6wuc2k45mnmj7hclx92cxr480uf5zw56cfa9mgms06lh0z',
              toAddress:
                'addr1qxp4ggttyqz3k2gkme9r7gqyp4gzjyvfjqqreqpfpp5dtp705rp4xesducet64d5ql6m053pkxe6cmhrk5jl6zvr23eqcsuck8',
              verified: true,
              bookmarked: Math.random() > 0.5,
              collection: 'Space',
              policy_id:
                'dac355946b4317530d9ec0cb142c63a4b624610786c2a32137d78e25',
              asset_id:
                '40fa2aa67258b4ce7b5782f74831d46a84c59a0ff0c28262fab21728.ClayNation1',
              collection_image:
                'https://image-optimizer.jpgstoreapis.com/QmPGJbXjsJgUDotcAiosu6Gspo84u3FkzAS3FaKmfctZJA?width=1200',
            }),
            tokens: [
              {
                name: 'ADA',
                amount: Math.random() * 100000,
              },
              {
                name: 'YUMMI',
                amount: Math.random() * 100000,
              },
              {
                name: 'JUNGLE',
                amount: Math.random() * 100000,
              },
              {
                name: 'ADA',
                amount: Math.random() * 100000,
              },
              {
                name: 'YUMMI',
                amount: Math.random() * 100000,
              },
              {
                name: 'JUNGLE',
                amount: Math.random() * 100000,
              },
              {
                name: 'ADA',
                amount: Math.random() * 100000,
              },
              {
                name: 'YUMMI',
                amount: Math.random() * 100000,
              },
              {
                name: 'JUNGLE',
                amount: Math.random() * 100000,
              },
              {
                name: 'ADA',
                amount: Math.random() * 100000,
              },
              {
                name: 'YUMMI',
                amount: Math.random() * 100000,
              },
              {
                name: 'JUNGLE',
                amount: Math.random() * 100000,
              },
              {
                name: 'ADA',
                amount: Math.random() * 100000,
              },
              {
                name: 'YUMMI',
                amount: Math.random() * 100000,
              },
              {
                name: 'JUNGLE',
                amount: Math.random() * 100000,
              },
            ],
          },
          {
            from: 'addr1qxp4ggttyqz3k2gkme9r7gqyp4gzjyvfjqqreqpfpp5dtp705rp4xesducet64d5ql6m053pkxe6cmhrk5jl6zvr23eqcsuck8',
            tokens: [
              {
                name: 'ADA',
                amount: Math.random() * 100000,
              },
            ],
          },
          {
            from: 'addr1qxp4ggttyqz3k2gkme9r7gqyp4gzjyvfjqqreqpfpp5dtp705rp4xesducet64d5ql6m053pkxe6cmhrk5jl6zvr23eqcsuck8',
            tokens: [
              {
                name: 'ADA',
                amount: Math.random() * 100,
              },
            ],
            assets: new Array(Math.floor(Math.random() * 5 + 1)).fill({
              initialPrice: parseInt(Math.random() * 100),
              currentPrice: parseInt(Math.random() * 200),
              name: 'Big Kong',
              image:
                'https://image-optimizer.jpgstoreapis.com/QmPGJbXjsJgUDotcAiosu6Gspo84u3FkzAS3FaKmfctZJA?width=1200',
              date: moment().format('DD MM YYYY:HH:mm:ss UTC'),
              fromAddress:
                'addr1qy0cqs09v6ffegzc3za5nk52w45jaqynna66a3pew0h3z5t8v69l6wuc2k45mnmj7hclx92cxr480uf5zw56cfa9mgms06lh0z',
              toAddress:
                'addr1qxp4ggttyqz3k2gkme9r7gqyp4gzjyvfjqqreqpfpp5dtp705rp4xesducet64d5ql6m053pkxe6cmhrk5jl6zvr23eqcsuck8',
              verified: true,
              bookmarked: Math.random() > 0.5,
              collection: 'Space',
              policy_id:
                'dac355946b4317530d9ec0cb142c63a4b624610786c2a32137d78e25',
              asset_id:
                '40fa2aa67258b4ce7b5782f74831d46a84c59a0ff0c28262fab21728.ClayNation1',
              collection_image:
                'https://image-optimizer.jpgstoreapis.com/QmPGJbXjsJgUDotcAiosu6Gspo84u3FkzAS3FaKmfctZJA?width=1200',
            }),
          },
          {
            from: 'addr1qxp4ggttyqz3k2gkme9r7gqyp4gzjyvfjqqreqpfpp5dtp705rp4xesducet64d5ql6m053pkxe6cmhrk5jl6zvr23eqcsuck8',
            tokens: [
              {
                name: 'ADA',
                amount: Math.random() * 100,
              },
            ],
            assets: new Array(Math.floor(Math.random() * 5 + 1)).fill({
              initialPrice: parseInt(Math.random() * 100),
              currentPrice: parseInt(Math.random() * 200),
              name: 'Big Kong',
              image:
                'https://image-optimizer.jpgstoreapis.com/QmPGJbXjsJgUDotcAiosu6Gspo84u3FkzAS3FaKmfctZJA?width=1200',
              date: moment().format('DD MM YYYY:HH:mm:ss UTC'),
              fromAddress:
                'addr1qy0cqs09v6ffegzc3za5nk52w45jaqynna66a3pew0h3z5t8v69l6wuc2k45mnmj7hclx92cxr480uf5zw56cfa9mgms06lh0z',
              toAddress:
                'addr1qxp4ggttyqz3k2gkme9r7gqyp4gzjyvfjqqreqpfpp5dtp705rp4xesducet64d5ql6m053pkxe6cmhrk5jl6zvr23eqcsuck8',
              verified: true,
              bookmarked: Math.random() > 0.5,
              collection: 'Space',
              policy_id:
                'dac355946b4317530d9ec0cb142c63a4b624610786c2a32137d78e25',
              asset_id:
                '40fa2aa67258b4ce7b5782f74831d46a84c59a0ff0c28262fab21728.ClayNation1',
              collection_image:
                'https://image-optimizer.jpgstoreapis.com/QmPGJbXjsJgUDotcAiosu6Gspo84u3FkzAS3FaKmfctZJA?width=1200',
            }),
          },
          {
            from: 'addr1qxp4ggttyqz3k2gkme9r7gqyp4gzjyvfjqqreqpfpp5dtp705rp4xesducet64d5ql6m053pkxe6cmhrk5jl6zvr23eqcsuck8',
            tokens: [
              {
                name: 'ADA',
                amount: Math.random() * 100,
              },
            ],
            assets: new Array(Math.floor(Math.random() * 5 + 1)).fill({
              initialPrice: parseInt(Math.random() * 100),
              currentPrice: parseInt(Math.random() * 200),
              name: 'Big Kong',
              image:
                'https://image-optimizer.jpgstoreapis.com/QmPGJbXjsJgUDotcAiosu6Gspo84u3FkzAS3FaKmfctZJA?width=1200',
              date: moment().format('DD MM YYYY:HH:mm:ss UTC'),
              fromAddress:
                'addr1qy0cqs09v6ffegzc3za5nk52w45jaqynna66a3pew0h3z5t8v69l6wuc2k45mnmj7hclx92cxr480uf5zw56cfa9mgms06lh0z',
              toAddress:
                'addr1qxp4ggttyqz3k2gkme9r7gqyp4gzjyvfjqqreqpfpp5dtp705rp4xesducet64d5ql6m053pkxe6cmhrk5jl6zvr23eqcsuck8',
              verified: true,
              bookmarked: Math.random() > 0.5,
              collection: 'Space',
              policy_id:
                'dac355946b4317530d9ec0cb142c63a4b624610786c2a32137d78e25',
              asset_id:
                '40fa2aa67258b4ce7b5782f74831d46a84c59a0ff0c28262fab21728.ClayNation1',
              collection_image:
                'https://image-optimizer.jpgstoreapis.com/QmPGJbXjsJgUDotcAiosu6Gspo84u3FkzAS3FaKmfctZJA?width=1200',
            }),
          },
        ],
        outputs: [
          {
            to: 'addr1qxp4ggttyqz3k2gkme9r7gqyp4gzjyvfjqqreqpfpp5dtp705rp4xesducet64d5ql6m053pkxe6cmhrk5jl6zvr23eqcsuck8',
            assets: new Array(Math.floor(Math.random() * 5 + 1)).fill({
              initialPrice: parseInt(Math.random() * 100),
              currentPrice: parseInt(Math.random() * 200),
              name: 'Big Kong',
              image:
                'https://image-optimizer.jpgstoreapis.com/QmPGJbXjsJgUDotcAiosu6Gspo84u3FkzAS3FaKmfctZJA?width=1200',
              date: moment().format('DD MM YYYY:HH:mm:ss UTC'),
              fromAddress:
                'addr1qy0cqs09v6ffegzc3za5nk52w45jaqynna66a3pew0h3z5t8v69l6wuc2k45mnmj7hclx92cxr480uf5zw56cfa9mgms06lh0z',
              toAddress:
                'addr1qxp4ggttyqz3k2gkme9r7gqyp4gzjyvfjqqreqpfpp5dtp705rp4xesducet64d5ql6m053pkxe6cmhrk5jl6zvr23eqcsuck8',
              verified: true,
              bookmarked: Math.random() > 0.5,
              collection: 'Space',
              policy_id:
                'dac355946b4317530d9ec0cb142c63a4b624610786c2a32137d78e25',
              asset_id:
                '40fa2aa67258b4ce7b5782f74831d46a84c59a0ff0c28262fab21728.ClayNation1',
              collection_image:
                'https://image-optimizer.jpgstoreapis.com/QmPGJbXjsJgUDotcAiosu6Gspo84u3FkzAS3FaKmfctZJA?width=1200',
            }),
            tokens: [
              {
                name: 'JUNGLE',
                amount: Math.random() * 100000,
              },
            ],
          },
          {
            to: 'addr1qxp4ggttyqz3k2gkme9r7gqyp4gzjyvfjqqreqpfpp5dtp705rp4xesducet64d5ql6m053pkxe6cmhrk5jl6zvr23eqcsuck8',
            assets: new Array(Math.floor(Math.random() * 5 + 1)).fill({
              initialPrice: parseInt(Math.random() * 100),
              currentPrice: parseInt(Math.random() * 200),
              name: 'Big Kong',
              image:
                'https://image-optimizer.jpgstoreapis.com/QmPGJbXjsJgUDotcAiosu6Gspo84u3FkzAS3FaKmfctZJA?width=1200',
              date: moment().format('DD MM YYYY:HH:mm:ss UTC'),
              fromAddress:
                'addr1qy0cqs09v6ffegzc3za5nk52w45jaqynna66a3pew0h3z5t8v69l6wuc2k45mnmj7hclx92cxr480uf5zw56cfa9mgms06lh0z',
              toAddress:
                'addr1qxp4ggttyqz3k2gkme9r7gqyp4gzjyvfjqqreqpfpp5dtp705rp4xesducet64d5ql6m053pkxe6cmhrk5jl6zvr23eqcsuck8',
              verified: true,
              bookmarked: Math.random() > 0.5,
              collection: 'Space',
              policy_id:
                'dac355946b4317530d9ec0cb142c63a4b624610786c2a32137d78e25',
              asset_id:
                '40fa2aa67258b4ce7b5782f74831d46a84c59a0ff0c28262fab21728.ClayNation1',
              collection_image:
                'https://image-optimizer.jpgstoreapis.com/QmPGJbXjsJgUDotcAiosu6Gspo84u3FkzAS3FaKmfctZJA?width=1200',
            }),
          },
          {
            tokens: [
              {
                name: 'ADA',
                amount: Math.random() * 100,
              },
            ],
          },
        ],
        type: [
          'MINT',
          'SWAP',
          'BURN',
          'BUY',
          'SELL',
          'LIST',
          'DELIST',
          'TRANSFER',
          'BORROWING',
          'LENDING',
        ][Math.floor(Math.random() * 9)],
      },
    },
  };
}

function TransactionPage({ transaction }) {
  return (
    <>
      <NextSeo {...SEO} />
      <Box className={styles.main}>
        <Box className={styles.marketsContainer} sx={{ maxWidth: 1600 }}>
          <Transaction transaction={transaction} />
        </Box>
      </Box>
    </>
  );
}

export default TransactionPage;

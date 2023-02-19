import { Box } from '@mui/material';
import React from 'react';
import styles from './TwitterQuotes.module.scss';
import { Icon } from '@iconify/react';
import classNames from 'classnames';

const quoteList = [
  {
    quote: `📈 The new Trading View UI on @CNFTJungle looking legit`,
    name: 'Derp Birds',
    handle: '@DerpBirdsNFT',
    link: 'https://twitter.com/DerpBirdsNFT/status/1590520851312840704',
    image:
      'https://pbs.twimg.com/profile_images/1540037998745718787/3zrw4Tox_400x400.jpg',
  },
  {
    quote: `Yesterday I managed to snipe one nft using sniping tool service from 
    @CNFTJungle
    
    
    Such a powerful utility have ever of an nft project
    One single hunter pass paid off in only one sale 🫡`,
    name: 'Bintang',
    handle: '@_bbbiiinnn',
    link: 'https://twitter.com/_bbbiiinnnn/status/1587818953875025921',
    image:
      'https://pbs.twimg.com/profile_images/1571716585420918784/zxXlS79K_400x400.jpg',
  },
  {
    quote: `I scooped up a 
    @CNFTJungle
     Hunter Pass the other day. Set it up 36ish hours ago. It’s already paid for itself! I had been curious about it and thought it could be really helpful, but damn I underestimated it’s real potential. Already secured my spot to burn & upgrade #cnft #nft`,
    name: 'jimmyd',
    handle: '@CryptoBotBoi',
    link: 'https://twitter.com/CryptoBotBoi/status/1587445671006699520',
    image:
      'https://pbs.twimg.com/profile_images/1588299096074452994/_iu4nxS5_400x400.jpg',
  },
  {
    quote: `1/5 For those who did not know! CNFT Jungle 
    @CNFTJungle
      just release Jungle Hunter Lifetime Pass along with Dedicated predator wallet to auto snipe certain trait or floor. This Wallet will snipe NFT without any signature.`,
    name: 'Zebet | Jellycube ✂️✂️✂️✂️',
    handle: '@BaagilFahmi',
    link: 'https://twitter.com/BaagilFahmi/status/1587814102512066560',
    image:
      'https://pbs.twimg.com/profile_images/1555692947798167554/2AsgPYoS_400x400.jpg',
  },
  {
    quote: `I love the new update of 
    @CNFTJungle
     mobile app 🔥🔥
    
    Feels good to buy nfts like a V.I.K. Pass with a badge for being doxxed with 
    @TedNationNFT
     
    
    Mark the date: NOV 19 
    @BlurryKits
     
    
    #CNFT #CNFTCommunity #CNFTCollection #CNFTogether #CardanoCommunity #CardanoNFTs #BKL`,
    name: '$Don_Alessio69',
    handle: '@Don_Alessio69',
    link: 'https://twitter.com/Don_Alessio69/status/1588824211224940544',
    image:
      'https://pbs.twimg.com/profile_images/1591575250864668672/palOxyZI_400x400.jpg',
  },
  {
    quote: `Lifetime acccess to predator sniping platform with hunter pass only 650 ada on secondary, you snooze  you lose... get sniping 🏹🏹🏹`,
    name: 'NFTDoevid $-25 $0144',
    handle: '@CNFTDoevid',
    link: 'https://twitter.com/CNFTDoevid/status/1587083294667153409',
    image:
      'https://pbs.twimg.com/profile_images/1582460432358547458/8cVNe1Gv_400x400.jpg',
  },
  {
    quote: `Non-holders: Oooh nice cheap NFT @CNFTJungle Pass holders: Aaaand... it's gone`,
    name: 'J₳B ⭕✨',
    handle: '@crypto_jed',
    link: 'https://twitter.com/crypto_jed/status/1586302857997062144',
    image:
      'https://pbs.twimg.com/profile_images/1588507341200461827/TU3DHcMz_400x400.jpg',
  },
  {
    quote: `While some are full of bullshit, others build & make the space safer. I was using Web CNFT jungle way before this, but for now, this will be my way to go Mobile APP. 

    @TedNationNFT
     
    @CNFTJungle`,
    name: '🇺🇦 Ethan(Broken Logic Seeker)',
    handle: '@etiensyo',
    link: 'https://twitter.com/etiensyo/status/1588661802724122624',
    image:
      'https://pbs.twimg.com/profile_images/1564601042611933191/eM3C7WoE_400x400.jpg',
  },
  {
    quote: `Do you need help determining how the royalties are distributed in your multiple-policy ID trade?

    Click the ⓘ to check a breakdown of the tokens with Est. Value, the weight assigned, and distribution.
    
    With Real-Time data powered by 
    @CNFTJungle
     💜⛺️`,
    name: 'Trading Tent🏕',
    handle: '@trading_tent',
    link: 'https://twitter.com/trading_tent/status/1587885352789987330',
    image:
      'https://pbs.twimg.com/profile_images/1562325777114435584/_isA8q1-_400x400.jpg',
  },
  {
    quote: `Have been thinking to get a quality and utility oriented #NFTs no second thought 
    @CNFTJungle
     
    
    #CNFTCommunity #CNFTProject`,
    name: 'Desmond | Eggscape Club',
    handle: '@desmondlth',
    link: 'https://twitter.com/desmondlth/status/1586343771310264322',
    image:
      'https://pbs.twimg.com/profile_images/1586194635868688384/lQ7ZmQjz_400x400.jpg',
  },
  {
    quote: `Great app and make sure to rate it peeps! Gotta get that Normie exposure 💪🏼`,
    name: 'CNFTdisiac.ada ⭕✨',
    handle: '@CNFTdisiac',
    link: 'https://twitter.com/CNFTdisiac/status/1587018648866037760',
    image:
      'https://pbs.twimg.com/profile_images/1588073474878312448/7pdS0Pxv_400x400.jpg',
  },
  {
    quote: `@CNFTJungle
    have a mobile app out for iOS. Great work!
   Need some collection images for 
   @Cardania_HQ
    guys? DM me`,
    name: 'Bagboy',
    handle: '@Bagboy7238',
    link: 'https://twitter.com/Bagboy7238/status/1587361161741221888',
    image:
      'https://pbs.twimg.com/profile_images/1499137612841377796/6ptiIXEm_400x400.jpg',
  },
  {
    quote: `Use 
    @CNFTJungle
     sniping tool. Set parameters and have it autobuy for you !
    
    You get access via the jungle lifetime pass.
    
    No need to go to jpg 😄`,
    name: 'bad0ne',
    handle: '@bad0ne829',
    link: 'https://twitter.com/bad0ne829/status/1588604217643892736',
    image:
      'https://pbs.twimg.com/profile_images/1588314752165580801/bvk_GKa7_400x400.jpg',
  },
  {
    quote: `lets get to sniping with those jungle Passes`,
    name: 'oshane_x2💊⚡🗻👔⛩️🐥🔪🎩',
    handle: '@VentusIncendia',
    link: 'https://twitter.com/VentusIncendia/status/1588874386320535553',
    image:
      'https://pbs.twimg.com/profile_images/1576167732101398529/S7kAfZ0I_400x400.jpg',
  },
  {
    quote: `Ready to snipe!`,
    name: 'groungh',
    handle: '@Groungh',
    link: 'https://twitter.com/Groungh/status/1586301357426081792',
    image:
      'https://pbs.twimg.com/profile_images/1535663945025036297/v5uYfT1m_400x400.jpg',
  },
  {
    quote: `I had the original and it paid off many times over.  Got less active and sold it.  Then got more active and needed another.  So glad this project minted again so I could get back in the jungle!`,
    name: 'CardaNomad',
    handle: '@CardaNomad_',
    link: 'https://twitter.com/CardaNomad_/status/1587497434543972355',
    image:
      'https://pbs.twimg.com/profile_images/1584305941327003649/6kSBVMy3_400x400.jpg',
  },
  {
    quote: `if you need to be ahead of the game. you should have this`,
    name: 'shoemur₳i',
    handle: '@shoemurai',
    link: 'https://twitter.com/shoemurai/status/1586905562176159744',
    image:
      'https://pbs.twimg.com/profile_images/1591605027851964419/ZtAerPE2_400x400.jpg',
  },
  {
    quote: `I have been using the app way back and I can say I enjoy it so much`,
    name: 'Dbroh MAFIA 🎩🎩🎩',
    handle: '@Dbroh3',
    link: 'https://twitter.com/Dbroh3/status/1586814147324420097',
    image:
      'https://pbs.twimg.com/profile_images/1587915192360370178/R71KrbQj_400x400.jpg',
  },
  {
    quote: `Lifetime acccess to predator sniping platform with hunter pass only 650 ada on secondary, you snooze  you lose... get sniping 🏹🏹🏹`,
    name: 'NFTDoevid $-25 $0144',
    handle: '@CNFTDoevid',
    link: 'https://twitter.com/CNFTDoevid/status/1587083294667153409',
    image:
      'https://pbs.twimg.com/profile_images/1582460432358547458/8cVNe1Gv_400x400.jpg',
  },
  {
    quote: `Non-holders: Oooh nice cheap NFT @CNFTJungle Pass holders: Aaaand... it's gone`,
    name: 'J₳B ⭕✨',
    handle: '@crypto_jed',
    link: 'https://twitter.com/crypto_jed/status/1586302857997062144',
    image:
      'https://pbs.twimg.com/profile_images/1588507341200461827/TU3DHcMz_400x400.jpg',
  },
  {
    quote: `While some are full of bullshit, others build & make the space safer. I was using Web CNFT jungle way before this, but for now, this will be my way to go Mobile APP. 

    @TedNationNFT
     
    @CNFTJungle`,
    name: '🇺🇦 Ethan(Broken Logic Seeker)',
    handle: '@etiensyo',
    link: 'https://twitter.com/etiensyo/status/1588661802724122624',
    image:
      'https://pbs.twimg.com/profile_images/1564601042611933191/eM3C7WoE_400x400.jpg',
  },
];

const Quote = ({ name, handle, quote, link, image }) => {
  return (
    <Box className={styles.quoteBox}>
      <Box className={styles.quote}>{quote}</Box>
      <Box className={styles.author}>
        <Box className={styles.autorCredentials}>
          <img src={image} alt="author" className={styles.authorImage} />
          <Box className={styles.authorNameBox}>
            <span className={styles.authorName}>{name}</span>
            <span
              className={styles.authorHandle}
              onClick={() =>
                window.open(`https://twitter.com/${handle}`, '_blank')
              }
            >
              {handle}
            </span>
          </Box>
        </Box>

        <Box
          className={styles.twitterButton}
          onClick={() => window.open(link, '_blank')}
        >
          <Icon icon="akar-icons:twitter-fill" width={17} />
        </Box>
      </Box>
    </Box>
  );
};

const TwitterQuotes = () => {
  return (
    <Box className={styles.quotesContainer}>
      <div className={styles.fade}>
        <Box className={classNames(styles.quotes, styles.scrollLeft)}>
          {quoteList.slice(0, 10).map((quote) => (
            <Quote {...quote} />
          ))}
        </Box>
      </div>
      <div className={styles.fade}>
        <Box className={classNames(styles.quotes, styles.scrollRight)}>
          {quoteList.slice(10, 20).map((quote) => (
            <Quote {...quote} />
          ))}
        </Box>
      </div>
    </Box>
  );
};

export default TwitterQuotes;

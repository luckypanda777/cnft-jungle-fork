import logo from 'assets/128x128square.png';
import Image from 'next/image';
import hammock from 'assets/hammock.png';
import woodcabin from 'assets/woodcabin.png';
import coffeeshop from 'assets/coffeeshop.png';
import beachhostel from 'assets/beachhostel.png';
import mysticmansion from 'assets/mysticmansion.png';
import exoticresort from 'assets/exoticresort.png';
import chilledkongs from 'assets/chilledkongs.png';
import craftsmen from 'assets/apesociety/craftsmen.png';
import artists from 'assets/apesociety/artists.png';
import explorers from 'assets/apesociety/explorers.png';
import merchants from 'assets/apesociety/merchants.png';
import military from 'assets/apesociety/military.png';
import nobles from 'assets/apesociety/nobles.png';
import royal from 'assets/apesociety/royal.png';
import apesociety from 'assets/apesociety/logo.png';
import infinite from 'assets/raisondetre/infinite.png';
import instinct from 'assets/raisondetre/instinct.png';
import reasoning from 'assets/raisondetre/reasoning.png';
import seeker from 'assets/raisondetre/seeker.png';
import thinking from 'assets/raisondetre/thinking.png';
import raisondetre from 'assets/raisondetre/logo.png';
import wennocat from 'assets/catunsupported.webp';
import army from 'assets/llamas/army.png';
import boss from 'assets/llamas/boss.png';
import herder from 'assets/llamas/herder.png';
import rocket from 'assets/llamas/rocket.png';
import star from 'assets/llamas/star.png';
import titan from 'assets/llamas/titan.png';
import whale from 'assets/llamas/whale.png';
import llamalogo from 'assets/llamas/logo.png';
import battery from 'assets/overexposed/battery.png';
import oe from 'assets/overexposed/oe.png';
import pill from 'assets/overexposed/pill.png';
import third from 'assets/overexposed/third.png';
import tv from 'assets/overexposed/tv.png';
import oelogo from 'assets/overexposed/logo.png';
import salty from 'assets/seagulls/salty.png';
import pilot from 'assets/seagulls/pilot.png';
import noble from 'assets/seagulls/noble.png';
import monarch from 'assets/seagulls/monarch.png';
import saltylogo from 'assets/seagulls/seagull.png';
import gold from 'assets/bcrc/gold.png';
import dmt from 'assets/bcrc/dmt.png';
import diamond from 'assets/bcrc/diamond.png';
import zombie from 'assets/bcrc/zombie.png';
import pharaoh from 'assets/bcrc/pharaoh.png';
import cheetah from 'assets/bcrc/cheetah.png';
import borgie from 'assets/borgs/borgie.png';
import borgboss from 'assets/borgs/boss.png';
import king from 'assets/borgs/king.png';
import borglogo from 'assets/borgs/icon.png';
import borgdarklogo from 'assets/borgs/logo_black.png';
import emperor from 'assets/borgs/emperor.png';
import vib from 'assets/borgs/vib.png';
import bcbrclogo from 'assets/bcrc/bcrc.jpeg';
import mandrillzlogo from 'assets/mandrillz/logo.png';
import collector from 'assets/mandrillz/collector.png';
import green from 'assets/jelly/green.png';
import ape from 'assets/jelly/ape.png';
import water from 'assets/jelly/water.png';
import dragon from 'assets/jelly/dragon.png';

const RoundImageWrapper = ({ width, height, src }) => {
  return (
    <div
      style={{
        overflow: 'hidden',
        borderRadius: 6,
        width,
        height,
      }}
    >
      <Image src={src} width={width} height={height} />
    </div>
  );
};

const tierPrices = [
  { name: 'Hunter', weeklyPrice: 15, monthlyPrice: 30, tierColor: '#51c775' },
  {
    name: 'Apex',
    weeklyPrice: 30,
    monthlyPrice: 75,
    tierColor: '#ffc107',
  },
  {
    name: 'Pink Orca',
    weeklyPrice: 250,
    monthlyPrice: 250,
    inviteOnly: true,
    tierColor: 'var(--logoColor)',
  },
];

const specialPricing = [
  {
    name: 'Wenno Cat',
    icon: <Image src={wennocat} width={50} height={50} />,
    rows: [
      {
        rule: 'Hold a Hunter/Jungle Wenno',
        name: 'Hunter',
        discount: '15% discount',
        discountPercentage: 2,
        stackable: true,
        maxDiscount: 50,
        pricingText: 'Discount on Hunter tier + 1 additional hunt.',
        icon: <Image src={wennocat} height={45} width={45} />,
      },
      {
        rule: 'Hold an Apex Wenno',
        name: 'Apex',
        discount: '20% discount',
        discountPercentage: 2,
        stackable: true,
        maxDiscount: 40,
        pricingText: 'Discount on Apex tier + 1 additional hunt.',
        icon: <Image src={wennocat} height={45} width={45} />,
      },
      {
        rule: 'Hold a Whale Wenno',
        name: 'Whale',
        discount: '25% discount',
        discountPercentage: 1,
        stackable: true,
        maxDiscount: 20,
        pricingText: 'Discount on any tier + 1 additional hunt.',
        icon: <Image src={wennocat} height={45} width={45} />,
      },
      {
        rule: 'Hold an Orca Wenno',
        name: 'Orca',
        discount: '30% discount',
        discountPercentage: 2,
        stackable: true,
        maxDiscount: 20,
        pricingText: 'Discount on Orca tier + 1 additional hunt.',
        icon: <Image src={wennocat} height={45} width={45} />,
      },
    ],
  },
  {
    name: 'Chilled Kongs',
    icon: <Image src={chilledkongs} width={50} height={50} />,
    rows: [
      {
        rule: '1-4 Kongs',
        name: 'Hammock',
        discount: '10% discount',
        discountPercentage: 10,
        icon: <Image src={hammock} height={35} width={45} />,
      },
      {
        rule: '5-10 Kongs',
        name: 'Wood Cabin',
        discount: '15% discount',
        discountPercentage: 15,
        icon: <Image src={woodcabin} height={35} width={45} />,
      },
      {
        rule: '11-20 Kongs',
        name: 'Coffee Shop',
        discount: '20% discount',
        discountPercentage: 20,
        icon: <Image src={coffeeshop} height={35} width={45} />,
      },
      {
        rule: '21-49 Kongs',
        name: 'Beach Hostel',
        discount: '25% discount',
        discountPercentage: 25,
        icon: <Image src={beachhostel} height={35} width={45} />,
      },
      {
        rule: '50-99 Kongs',
        name: 'Mystic Mansion',
        discount: '30% discount',
        discountPercentage: 30,
        icon: <Image src={mysticmansion} height={35} width={45} />,
      },
      {
        rule: '100+ Kongs',
        name: 'Exotic Resort',
        discount: '40% discount',
        discountPercentage: 40,
        icon: <Image src={exoticresort} height={35} width={45} />,
      },
    ],
  },
  {
    name: 'Jellycubes by the Big',
    lightIcon: <RoundImageWrapper src={dragon} width={50} height={50} />,
    darkIcon: <RoundImageWrapper src={dragon} width={50} height={50} />,
    rows: [
      {
        rule: '1-2 Jellycubes',
        name: 'Jelly Army',
        discount: '20% discount',
        discountPercentage: 20,
        icon: <RoundImageWrapper src={green} width={50} height={50} />,
      },
      {
        rule: '3-5 Jellycubes',
        name: 'Jellynaught',
        discount: '25% discount',
        discountPercentage: 25,
        icon: <RoundImageWrapper src={ape} width={50} height={50} />,
      },
      {
        rule: '6+ Jellycubes',
        name: 'Jelly Whale',
        discount: '35% discount',
        discountPercentage: 35,
        icon: <RoundImageWrapper src={water} width={50} height={50} />,
      },
      {
        rule: 'Inner Circle',
        name: 'FnF Jellycube or Jargaryen',
        discount: '40% discount',
        discountPercentage: 40,
        icon: <RoundImageWrapper src={dragon} width={50} height={50} />,
      },
    ],
  },
  {
    name: 'Ape Society',
    icon: <Image src={apesociety} width={50} height={50} />,
    rows: [
      {
        rule: 'Hold a Craftsman',
        name: 'Craftsmen',
        discount: '10% discount',
        discountPercentage: 10,
        icon: <Image src={craftsmen} height={35} width={35} />,
      },
      {
        rule: 'Hold an Artist',
        name: 'Artists',
        discount: '15% discount',
        discountPercentage: 15,
        icon: <Image src={artists} height={35} width={35} />,
      },
      {
        rule: 'Hold a Explorer',
        name: 'Explorers',
        discount: '20% discount',
        discountPercentage: 20,
        icon: <Image src={explorers} height={35} width={35} />,
      },
      {
        rule: 'Hold a Merchant',
        name: 'Merchants',
        discount: '25% discount',
        discountPercentage: 25,
        icon: <Image src={merchants} height={35} width={35} />,
      },
      {
        rule: 'Hold a Military Advisor',
        name: 'Military Officers',
        discount: '30% discount',
        discountPercentage: 30,
        icon: <Image src={military} height={35} width={35} />,
      },
      {
        rule: 'Hold a Royal Advisor',
        name: 'Royal Advisors',
        discount: '35% discount',
        discountPercentage: 35,
        icon: <Image src={nobles} height={35} width={35} />,
      },
      {
        rule: 'Hold Noble Ape',
        name: 'Nobles',
        discount: '40% discount',
        discountPercentage: 40,
        icon: <Image src={royal} height={35} width={35} />,
      },
    ],
  },
  {
    name: 'Mandrillz',
    icon: <Image src={mandrillzlogo} width={50} height={50} />,
    rows: [
      {
        rule: '1-4 Mandrillz',
        name: 'Rogue Drillz',
        discount: '10% discount',
        discountPercentage: 10,
        icon: <Image src={mandrillzlogo} height={35} width={35} />,
      },
      {
        rule: '5-10 Mandrillz',
        name: 'Guardian Drillz',
        discount: '15% discount',
        discountPercentage: 15,
        icon: <Image src={mandrillzlogo} height={35} width={35} />,
      },
      {
        rule: '11-15 Mandrillz',
        name: 'Alpha Drillz',
        discount: '20% discount',
        discountPercentage: 20,
        icon: <Image src={mandrillzlogo} height={35} width={35} />,
      },
      {
        rule: '16-24 Mandrillz',
        name: 'Boss Drill',
        discount: '25% discount',
        discountPercentage: 25,
        icon: <Image src={mandrillzlogo} height={35} width={35} />,
      },
      {
        rule: '25+ Mandrillz',
        name: 'Cleon Family',
        discount: '30% discount',
        discountPercentage: 30,
        icon: <Image src={mandrillzlogo} height={35} width={35} />,
      },
      {
        rule: 'Own 1 of each Fur',
        name: 'Super Drillz',
        discount: '40% discount',
        discountPercentage: 40,
        icon: <Image src={collector} height={35} width={35} />,
      },
    ],
  },
  {
    name: "Raison D'etre",
    icon: <Image src={raisondetre} width={50} height={50} />,
    rows: [
      {
        rule: '1-3 Cryo-Genesis',
        name: 'Natural Instinct',
        discount: '10% discount',
        discountPercentage: 10,
        icon: <Image src={instinct} height={35} width={35} />,
      },
      {
        rule: '4-8 Cryo-Genesis',
        name: 'Conscious Reasoning',
        discount: '15% discount',
        discountPercentage: 15,
        icon: <Image src={reasoning} height={35} width={35} />,
      },
      {
        rule: '9-13 Cryo-Genesis',
        name: 'Logical Thinking',
        discount: '25% discount',
        discountPercentage: 25,
        icon: <Image src={thinking} height={35} width={35} />,
      },
      {
        rule: '14-19 Cryo-Genesis',
        name: 'Truth Seeker',
        discount: '35% discount',
        discountPercentage: 35,
        icon: <Image src={seeker} height={35} width={35} />,
      },
      {
        rule: '20+ Cryo-Genesis',
        name: 'Infinite Comprehension',
        discount: '40% discount',
        discountPercentage: 40,
        icon: <Image src={infinite} height={35} width={35} />,
      },
    ],
  },
  {
    name: 'Lazy Llamas',
    icon: <RoundImageWrapper src={llamalogo} width={50} height={50} />,
    rows: [
      {
        rule: '1-4 Llamas',
        name: 'Llama Herder',
        discount: '10% discount',
        discountPercentage: 10,
        icon: <Image src={herder} height={35} width={35} />,
      },
      {
        rule: '5-10 Llamas',
        name: 'Llama Army',
        discount: '15% discount',
        discountPercentage: 15,
        icon: <Image src={army} height={35} width={35} />,
      },
      {
        rule: '11-19 Llamas',
        name: 'Llama Bo$$',
        discount: '20% discount',
        discountPercentage: 20,
        icon: <Image src={boss} height={35} width={35} />,
      },
      {
        rule: '20-49 Llamas',
        name: 'Llama Whale',
        discount: '25% discount',
        discountPercentage: 25,
        icon: <Image src={whale} height={35} width={35} />,
      },
      {
        rule: '50-99 Llamas',
        name: 'Llama TITAN',
        discount: '30% discount',
        discountPercentage: 30,
        icon: <Image src={titan} height={35} width={35} />,
      },
      {
        rule: '100+ Llamas',
        name: 'Supreme Rocket Scientist',
        discount: '35% discount',
        discountPercentage: 35,
        icon: <Image src={rocket} height={35} width={35} />,
      },
      {
        rule: '200+ Llamas',
        name: 'Llama Star Navigator',
        discount: '40% discount',
        discountPercentage: 40,
        icon: <Image src={star} height={35} width={35} />,
      },
    ],
  },
  {
    name: 'Over Exposed',
    icon: <RoundImageWrapper src={oelogo} width={50} height={50} />,
    rows: [
      {
        rule: 'Hold a OE Collectable',
        name: 'Collectable',
        discount: '10% discount',
        discountPercentage: 10,
        icon: <RoundImageWrapper src={tv} width={35} height={35} />,
      },
      {
        rule: 'Hold a Genesis Token',
        name: '35mm',
        discount: '15% discount',
        discountPercentage: 15,
        icon: <Image src={battery} height={35} width={35} />,
      },
      {
        rule: 'Hold 1 of each Genesis color',
        name: 'Complete Set',
        discount: '25% discount',
        discountPercentage: 25,
        icon: <Image src={third} height={35} width={35} />,
      },
      {
        rule: 'Hold a Mekanism',
        name: '120mm',
        discount: '30% discount',
        discountPercentage: 35,
        icon: <Image src={pill} height={35} width={35} />,
      },
      {
        rule: 'Hold a 1:1 Mekanism',
        name: '1:1',
        discount: '40% discount',
        discountPercentage: 40,
        icon: <Image src={oe} height={35} width={35} />,
      },
    ],
  },
  {
    name: 'Salty Seagulls Society',
    icon: <RoundImageWrapper src={saltylogo} width={50} height={50} />,
    rows: [
      {
        rule: 'Hold a Citizenry',
        name: 'Citizenry',
        discount: '10% discount',
        discountPercentage: 10,
        icon: <RoundImageWrapper src={salty} width={35} height={35} />,
      },
      {
        rule: 'Hold a Protector',
        name: 'Protectors',
        discount: '20% discount',
        discountPercentage: 20,
        icon: <RoundImageWrapper src={pilot} width={35} height={35} />,
      },
      {
        rule: 'Hold a Noble',
        name: 'Nobles',
        discount: '30% discount',
        discountPercentage: 30,
        icon: <RoundImageWrapper src={noble} width={35} height={35} />,
      },
      {
        rule: 'Hold a Monarch',
        name: 'Monarchs',
        discount: '40% discount',
        discountPercentage: 40,
        icon: <RoundImageWrapper src={monarch} width={35} height={35} />,
      },
    ],
  },
  {
    name: 'Boss Cat Rocket Club',
    icon: <RoundImageWrapper src={bcbrclogo} width={50} height={50} />,
    rows: [
      {
        rule: '10 Boss Planet / 1 Boss Cat / 10 Vox',
        name: 'Cheetah',
        discount: '10% discount',
        discountPercentage: 10,
        icon: <RoundImageWrapper src={cheetah} width={35} height={35} />,
      },
      {
        rule: '5-10 Boss Cats or Rocket Parts',
        name: 'Pharaoh',
        discount: '20% discount',
        discountPercentage: 20,
        icon: <RoundImageWrapper src={pharaoh} width={35} height={35} />,
      },
      {
        rule: '10- 19 Boss Cats or Rocket Parts',
        name: 'Zombie',
        discount: '25% discount',
        discountPercentage: 25,
        icon: <RoundImageWrapper src={zombie} width={35} height={35} />,
      },
      {
        rule: '20-29 Boss Cats or Rocket Parts',
        name: 'Gold',
        discount: '30% discount',
        discountPercentage: 30,
        icon: <RoundImageWrapper src={gold} width={35} height={35} />,
      },
      {
        rule: '30< Boss Cats or Rocket Parts ',
        name: 'DMT Gold',
        discount: '35% discount',
        discountPercentage: 35,
        icon: <RoundImageWrapper src={dmt} width={35} height={35} />,
      },
      {
        rule: '6 Full Rockets or 6 Top 1k cats',
        name: 'Diamond',
        discount: '40% discount',
        discountPercentage: 40,
        icon: <RoundImageWrapper src={diamond} width={35} height={35} />,
      },
    ],
  },
  {
    name: 'Borg Club',
    lightIcon: <RoundImageWrapper src={borgdarklogo} width={75} height={50} />,
    darkIcon: <RoundImageWrapper src={borglogo} width={75} height={50} />,
    rows: [
      {
        rule: '1-4 Borgs',
        name: 'Borgie',
        discount: '10% discount',
        discountPercentage: 10,
        icon: <RoundImageWrapper src={borgie} width={35} height={35} />,
      },
      {
        rule: '5-11 Borgs',
        name: 'Boss',
        discount: '20% discount',
        discountPercentage: 20,
        icon: <RoundImageWrapper src={borgboss} width={35} height={35} />,
      },
      {
        rule: '12-24 Borgs',
        name: 'King',
        discount: '35% discount',
        discountPercentage: 35,
        icon: <RoundImageWrapper src={king} width={35} height={35} />,
      },
      {
        rule: '25+ Borgs',
        name: 'Emperor',
        discount: '40% discount',
        discountPercentage: 40,
        icon: <RoundImageWrapper src={emperor} width={35} height={35} />,
      },
      {
        rule: 'Be a VIB',
        name: 'VIB’s',
        discount: '40% discount',
        discountPercentage: 40,
        icon: <RoundImageWrapper src={vib} width={35} height={35} />,
      },
    ],
  },
];

const features = [
  {
    header: <Image src={logo} />,
    headerStyle: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
    },
    rows: [
      'Hunt Amount (with Harpoons)',
      'Price Hunt',
      'Floor Harpoon',
      'Rarity Injection',
      'Rarity Checks',
      'Quick Snipe Delay',
      'Drop Huntdown',
      'Additional Hunts*',
      'Rarity Hunt',
      'Rewards Hunt',
      'Traits Hunt',
      'Auction Hunt***',
      'Snipe fee',
      'Jungle Exclusive Analytics',
    ],
    logo: true,
  },
  {
    tier: 'Free',
    free: true,
    rows: [
      'No hunts',
      false,
      false,
      true,
      true,
      false,
      true,
      false,
      false,
      false,
      false,
      false,
      false,
      'Coming Soon',
    ],
    tierColor: '#51c775',
  },
  {
    tier: 'Hunter',
    weeklyPrice: '$15 in ADA',
    monthlyPrice: '$30 in ADA',
    yearlyPrice: '$300 in ADA',
    weeklyPriceValue: 15,
    monthlyPriceValue: 30,
    yearlyPriceValue: 300,
    rows: [
      'up to 10',
      true,
      true,
      true,
      true,
      '1 block',
      true,
      '+$3 in ADA per hunt / m',
      false,
      false,
      false,
      false,
      '3%',
      'Coming Soon',
    ],
    tierColor: '#f89993',
  },
  {
    tier: 'Apex',
    weeklyPrice: '$30 in ADA',
    monthlyPrice: '$75 in ADA',
    yearlyPrice: '$750 in ADA',
    weeklyPriceValue: 30,
    monthlyPriceValue: 75,
    yearlyPriceValue: 750,
    rows: [
      'up to 10',
      true,
      true,
      true,
      true,
      '1 block',
      true,
      '+$3 in ADA per hunt / m',
      true,
      false,
      '1 trait per hunt',
      true,
      '3%',
      'Coming Soon',
    ],
    tierColor: '#ffc107',
  },
  {
    tier: 'Yummi Star',
    weeklyPrice: 40,
    monthlyPrice: 100,
    yearlyPrice: 1000,
    rows: [
      'up to 20',
      true,
      true,
      true,
      true,
      '1 block',
      true,
      '+$3 in ADA per hunt / m',
      true,
      true,
      '1 trait per hunt',
      true,
      '3%',
      'Coming Soon',
    ],
    tierColor: 'var(--primaryColor)',
    currency: 'yummi',
  },
  {
    tier: 'Pink Orca',
    monthlyPriceValue: 350,
    yearlyPriceValue: 3500,
    rows: [
      'Unlimited',
      true,
      true,
      true,
      true,
      'No delay',
      true,
      'Unlimited',
      true,
      true,
      'Unlimited',
      true,
      '3%',
      'Coming Soon',
    ],
    tierColor: 'var(--logoColor)',
  },
];

export { features, specialPricing, tierPrices };

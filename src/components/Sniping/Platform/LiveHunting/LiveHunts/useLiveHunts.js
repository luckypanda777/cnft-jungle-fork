import { ReconnectingEventSource } from 'components/LiveListings/ReconnectingEventSource';
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Context as SearchContext } from 'context/SearchContext';
import { Context as AuthContext } from 'context/AuthContext';
import { useRouter } from 'next/router';
import { getSingleAssetInfo } from 'apiProvider';
import { assetIdToHex } from 'utils/cardanoUtils';

let previousAssets = [];

const FEED_URL = 'https://feed.cnftjungle.app/stream';

// 'https://feed.cnftjungle.app'
// 'http://108.61.89.133/stream'

const useLiveHunts = (policyId, connect) => {
  const router = useRouter();
  const {
    state: { user },
  } = useContext(AuthContext);
  const {
    state: { huntList },
    addLiveHunt,
  } = useContext(SearchContext);
  const sourceRef = useRef();
  const [feedConnected, setFeedConnected] = useState(false);

  const startFeedListener = useCallback(
    (permissions) => {
      const eventCallback = async (e) => {
        if (!feedConnected) setFeedConnected(true);

        if (!e.data) return;

        const listing = JSON.parse(e.data);

        const { asset, link } = listing;

        if (!asset) return;

        let {
          price,
          policyID,
          assetName,
          assetImage,
          assetNumber,
          traits,
          rarity_rank,
          assetID,
          rewards,
        } = asset;

        price = price / 1000000;

        console.log(
          'New Trait Listing',
          policyID,
          assetName,
          assetID,
          price / 1000000,
          assetImage,
          rarity_rank,
          rewards,
          traits
        );

        try {
          console.log(
            'PREVIOUS ASSETS',
            previousAssets,
            'IS DUPLICATE',
            previousAssets?.includes(assetID) ? 'YES' : 'NO'
          );

          if (previousAssets?.includes(assetID)) return;

          previousAssets = [assetID, ...(previousAssets || [])].splice(0, 5);
        } catch (err) {
          console.log(err);
        }

        console.log('Hunt List', huntList);
        console.log('_________________________');

        const matchedSearch = await Promise.any(
          huntList
            .filter((s) => !s.isStopped)
            .filter((s) => {
              const collection = s.rules?.find(
                (rule) => rule.label === 'collection'
              );

              if (!collection?.value) {
                console.log('NO COLLECTION', s);
                return false;
              }

              console.log(
                'CHECKING POLICY',
                policyID,
                collection.value.policies
              );
              return (
                policyID === collection.value.policies ||
                policyID === collection.value.name
              );
            })
            .map((s) => {
              return new Promise(async (resolve, reject) => {
                const syncRulesResults = s.rules
                  .filter((rule) => rule.value || rule.value === 0)
                  .map((rule) => {
                    const { label, value } = rule;

                    console.log('CHECKING RULE', label, value);

                    if (label === 'priceMin') {
                      console.log('CHECKING PRICE MIN', price, value);
                      console.log('RESULT', price >= value);

                      return price >= value;
                    }

                    if (label === 'priceMax') {
                      console.log('CHECKING PRICE MAX', price, value);
                      console.log('RESULT', price <= value);

                      return price <= value;
                    }

                    if (label === 'specificName') {
                      console.log('CHECKING SPECIFIC NAME', assetName, value);

                      const isMultiple = value.includes(',');

                      const result = isMultiple
                        ? value
                            .split(',')
                            .some((s) =>
                              assetName
                                .toLowerCase()
                                .includes(s.toString().toLowerCase())
                            )
                        : assetName
                            .toLowerCase()
                            .includes(value.toString().toLowerCase());

                      console.log('RESULT', result);

                      return result;
                    }

                    if (label === 'specificRegex') {
                      console.log(
                        'CHECKING SPECIFIC REGEX',
                        assetName,
                        assetNumber,
                        value
                      );

                      const result =
                        new RegExp(value, 'gmi').test(assetName || '') ||
                        value
                          .split(',')
                          .some((s) =>
                            new RegExp(s, 'gmi').test(assetName || '')
                          );

                      console.log('RESULT', result);

                      return result;
                    }

                    if (label === 'specificSerial') {
                      console.log(
                        'CHECKING SPECIFIC SERIAL',
                        assetNumber,
                        value
                      );

                      const isMultiple = value.includes(',');

                      const result = isMultiple
                        ? value.split(',').some((s) => s == assetNumber)
                        : value == assetNumber;

                      console.log('RESULT', result);

                      return result;
                    }

                    if (label === 'specificAssetId') {
                      console.log('CHECKING SPECIFIC ID', assetID, value);

                      const isMultple = value.includes(',');

                      const result = isMultple
                        ? value.split(',').some((s) => s === assetID)
                        : value === assetID;

                      console.log('RESULT', result);

                      return result;
                    }

                    if (label === 'rarityMin') {
                      console.log('CHECKING RARITY MIN', assetID, value);
                      console.log('RESULT', rarity_rank >= value);

                      if (rarity_rank === 0) return false;

                      return rarity_rank >= value;
                    }

                    if (label === 'rarityMax') {
                      console.log('CHECKING RARITY MAX', assetID, value);
                      console.log('RESULT', rarity_rank <= value);

                      if (rarity_rank === 0) return false;

                      return rarity_rank <= value;
                    }

                    if (label === 'rewardMin') {
                      console.log('CHECKING REWARD MIN', assetID, value);
                      console.log('RESULT', rewards >= value);

                      return rewards >= value;
                    }

                    if (label === 'rewardMax') {
                      console.log('CHECKING REWARD MAX', assetID, value);
                      console.log('RESULT', rewards <= value);

                      return rewards <= value;
                    }

                    // [TODO] - Add support for other rarity sources
                    // if(label==='raritySource') {
                    //   return value === 'CNFT'
                    // }

                    if (label === 'traits') {
                      console.log('CHECKING TRAITS', traits, value);

                      const assetTraits = Object.entries(traits || {}).map(
                        ([traitKey, traitValue]) =>
                          `${traitKey} / ${traitValue}`
                      );

                      const useAndTraitLogic = s.rules.find(
                        (r) => r.label === 'useAndTraitLogic'
                      )?.value;

                      console.log(
                        'CHECKING TRAITS',
                        assetTraits,
                        value,
                        useAndTraitLogic ? 'USER AND LOGIC' : 'USER OR LOGIC'
                      );
                      const matchesTraits = useAndTraitLogic
                        ? value?.every((trait) => assetTraits?.includes(trait))
                        : value?.some((trait) => assetTraits?.includes(trait));

                      console.log('RESULT', matchesTraits);

                      return matchesTraits;
                    }

                    return true;
                  });

                const asyncRules = s.rules?.filter((rule) =>
                  [
                    'floorPercentage',
                    'traitFloorPercentage',
                    'minTraitRarityPercentage',
                    'maxTraitRarityPercentage',
                  ].includes(rule.label)
                );

                console.log('SYNC RULES RESULT', syncRulesResults);

                try {
                  if (asyncRules.length === 0) {
                    if (syncRulesResults.every((r) => r)) {
                      return resolve(s);
                    } else {
                      return reject();
                    }
                  }

                  const assetInfo = await fetch(
                    `https://api.cnftjungle.app/assets/asset-info/${assetIdToHex(
                      assetID
                    )}`
                  ).then((res) => res.json());

                  console.log('GOT ASSET INFO', assetInfo);

                  if (!assetInfo) return reject();

                  const asyncRulesResults =
                    asyncRules.length === 0
                      ? []
                      : asyncRules
                          .filter((rule) => rule.value || rule.value === 0)
                          .map((rule) => {
                            const { label, value } = rule;

                            if (label === 'floorPercentage') {
                              console.log('CHECKING FLOOR PERCENTAGE', value);

                              const absolutePercentage = s.rules.find(
                                (r) => r.label === 'absolutePercentage'
                              )?.value;

                              const floorBelowPrice =
                                (assetInfo?.floor || 1) * (1 - value / 100);

                              console.log(
                                'FLOOR BELOW PRICE',
                                assetInfo?.floor,
                                (assetInfo?.floor || 1) * 1 - value / 100
                              );

                              const floorAbovePrice =
                                (assetInfo?.floor || 1) * (1 + value / 100);

                              console.log(
                                'FLOOR ABOVE PRICE',
                                assetInfo?.floor,
                                (assetInfo?.floor || 1) * (1 + value / 100)
                              );

                              const result = absolutePercentage
                                ? price <= floorAbovePrice
                                : price <= floorBelowPrice;
                              console.log('RESULT', result);

                              return result;
                            }

                            if (label === 'traitFloorPercentage') {
                              console.log(
                                'CHECKING TRAIT FLOOR PERCENTAGE',
                                value
                              );

                              const absolutePercentage = s.rules.find(
                                (r) => r.label === 'absolutePercentage'
                              )?.value;

                              const traits = (
                                s.rules.find((r) => r.label === 'traits')
                                  ?.value || []
                              ).map((trait) => {
                                const hasAttributesString =
                                  trait.includes('attributes / ');
                                const noAttributedTrait = trait.replace(
                                  'attributes / ',
                                  ''
                                );

                                return {
                                  traitKey: hasAttributesString
                                    ? 'attributes / ' + trait.split(' / ')[1]
                                    : noAttributedTrait.split(' / ')[0],
                                  traitValue: noAttributedTrait.split(' / ')[1],
                                };
                              });

                              const traitFloorBelowPrice = traits.some(
                                (trait) => {
                                  const traitFloor =
                                    assetInfo?.traitfloors?.[trait.traitKey]?.[
                                      trait.traitValue
                                    ] || 1;

                                  console.log(
                                    'TRAIT FLOOR BELOW',
                                    trait,
                                    price,
                                    traitFloor,
                                    1 - value / 100,
                                    traitFloor * (1 - value / 100)
                                  );

                                  return (
                                    price <= traitFloor * (1 - value / 100)
                                  );
                                }
                              );

                              const traitFloorAbovePrice = traits.some(
                                (trait) => {
                                  const traitFloor =
                                    assetInfo?.traitfloors?.[trait.traitKey]?.[
                                      trait.traitValue
                                    ] || 1;

                                  console.log(
                                    'TRAIT FLOOR ABOVE',
                                    trait,
                                    price,
                                    traitFloor,
                                    1 - value / 100,
                                    traitFloor * (1 + value / 100)
                                  );

                                  return (
                                    price <= traitFloor * (1 + value / 100)
                                  );
                                }
                              );

                              const result = absolutePercentage
                                ? traitFloorAbovePrice
                                : traitFloorBelowPrice;

                              console.log('RESULT', result);

                              return result;
                            }

                            if (
                              label === 'maxTraitRarityPercentage' ||
                              label === 'minTraitRarityPercentage'
                            ) {
                              const minTraitRarityPercentage =
                                s.rules.find(
                                  (r) => r.label === 'minTraitRarityPercentage'
                                )?.value || 0;
                              const maxTraitRarityPercentage =
                                s.rules.find(
                                  (r) => r.label === 'maxTraitRarityPercentage'
                                )?.value || 100;
                              const traitCategories = s.rules.find(
                                (r) => r.label === 'traitCategories'
                              )?.value;

                              console.log(
                                'CHECKING TRAIT RARITY PERCENTAGE BETWEEN',
                                minTraitRarityPercentage,
                                'AND',
                                maxTraitRarityPercentage,
                                'TRAIT CATEGORIES',
                                traitCategories
                              );

                              console.log(
                                'ASSET TRAITS',
                                Object.entries(assetInfo.traits).map(
                                  ([traitKey, traitValue]) => ({
                                    traitKey,
                                    traitValue,
                                  })
                                )
                              );

                              const result =
                                Object.entries(assetInfo.traits)
                                  .map(([traitKey, traitValue]) => ({
                                    traitKey,
                                    traitValue,
                                  }))
                                  .filter(({ traitKey }) => {
                                    return (
                                      !traitCategories ||
                                      traitCategories?.includes(traitKey)
                                    );
                                  })
                                  .some((trait) => {
                                    const traitFrequency =
                                      assetInfo.collection_traitslist?.[
                                        trait.traitKey
                                      ]?.[trait.traitValue] /
                                      (assetInfo.collection_supply ||
                                        Object.values(
                                          assetInfo?.collection_traitslist
                                            .traitcount || {}
                                        ).reduce((acc, curr) => acc + curr, 0));

                                    console.log(
                                      'TRAIT FREQUENCY RESULT',
                                      traitFrequency * 100,
                                      maxTraitRarityPercentage >=
                                        traitFrequency * 100,
                                      minTraitRarityPercentage <=
                                        traitFrequency * 100
                                    );

                                    const result =
                                      maxTraitRarityPercentage >=
                                        traitFrequency * 100 &&
                                      minTraitRarityPercentage <=
                                        traitFrequency * 100;

                                    return result;
                                  }) || false;

                              console.log('RESULT', result);

                              return result;
                            }

                            return true;
                          });

                  console.log('SYNC RULES RESULT', syncRulesResults);
                  console.log('ASYNC RULES RESULT', asyncRulesResults);

                  if (
                    [...asyncRulesResults, ...syncRulesResults].every((r) => r)
                  ) {
                    return resolve(s);
                  } else {
                    return reject();
                  }
                } catch (err) {
                  console.log(err);
                  return reject();
                }
              });
            })
        ).catch((err) => {
          console.log(err);
          return false;
        });

        console.log('_________________________');
        console.log('FINAL RESULT MATCHED SEARCH', matchedSearch);

        if (matchedSearch) {
          setTimeout(() => {
            addLiveHunt({
              ...asset,
              listing_price: price / 1000000,
              link,
              huntLabel: matchedSearch.label,
            });
          }, (permissions === 'orca' ? 0 : permissions === 'apex' ? 3 : permissions === 'yummi' ? 3 : permissions === 'hunter' ? 5 : 7) * 1000);
        }
      };

      if (connect) {
        // open new source
        if (sourceRef.current) {
          sourceRef.current.removeEventListener('trait', eventCallback);
          sourceRef.current.close();
          sourceRef.current = null;
          sourceRef.current = new ReconnectingEventSource(FEED_URL);
          sourceRef.current.addEventListener('trait', eventCallback);
        } else {
          sourceRef.current = new ReconnectingEventSource(FEED_URL);
          sourceRef.current.addEventListener('trait', eventCallback);
        }
      }
    },
    [policyId, user?.snipeTier, previousAssets]
  );

  useEffect(() => {
    startFeedListener(user.snipeTier);

    return () => {
      if (router.query !== 'live' && sourceRef.current) {
        sourceRef.current.close();
        sourceRef.current = null;
      }
    };
  }, [policyId, user?.snipeTier]);

  const connected = useMemo(() => {
    return sourceRef.current?.readyState === 1 || feedConnected;
  }, [
    user?.snipeTier,
    policyId,
    sourceRef.current?.readyState,
    router.query,
    feedConnected,
  ]);

  return connected;
};

export { useLiveHunts };

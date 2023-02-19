const isArray = (arr) => {
  return Object.prototype.toString.call(arr) === '[object Array]';
};

const isIterable = (obj) => {
  // checks for null and undefined
  if (obj == null) {
    return false;
  }
  return typeof obj[Symbol.iterator] === 'function';
};

export const flattenArrays = (arr) =>
  isIterable(arr) ? [].concat(...arr) : arr;

const formatNestedTraitForFilter = (trait) => {
  const output = {};

  trait.value.forEach((value) => {
    const [[subName, subValue]] = Object.entries(value);
    output[trait.name] = { [subName]: subValue };
  });

  return output;
};

const formatNestedTraitForDisplay = (trait) => {
  const output = [];

  trait.value.forEach((value) => {
    const [[subName, subValue]] = Object.entries(value);
    output.push({ name: trait.name + '///' + subName, value: subValue });
  });

  return output;
};

const getTraitRank = (trait, value) => {
  const traitKeys = Object.entries(trait)
    .sort((a, b) => {
      return a[1] - b[1];
    })
    .map((el) => el[0]);

  return `${traitKeys.indexOf(value) + 1}/${traitKeys.length}`;
};

const formatTraits = (asset, collection) => {
  if (Object.entries(asset.traits || {}).length === 0 || !collection) return [];
  let traits = [];

  const formatTrait = (trait) => {
    if (typeof trait.value === 'string') {
      return {
        name: trait.name,
        value: trait.value,
      };
    }

    if (isArray(trait.value)) {
      if (typeof trait.value[0] === 'object' && trait.value[0] !== null) {
        return formatNestedTraitForDisplay(trait);
      }

      return trait.value.map((t) => ({
        name: trait.name,
        value: t,
      }));
    }

    if (typeof trait.value === 'object' && trait.value !== null) {
      return formatTrait(trait.value);
    }

    if (!trait.name) {
      return Object.entries(trait).map(([key, value]) => ({
        name: key,
        value,
      }));
    }

    return { name: trait.name, value: trait.value };
  };

  Object.entries(asset.traits).map(([name, value]) => {
    const trait = formatTrait({ name, value });
    return traits.push(trait);
  });

  const formattedTraits = flattenArrays(traits);
  const percentagedTraits = formattedTraits.map((trait) => {
    const { name, value } = trait;

    let collectionFrequency = 0;
    if (name.split('///').length > 1) {
      const [parent, child] = name.split('///');
      if (collection.traitlist[parent]) {
        if (collection.traitlist[parent][child]) {
          collectionFrequency = collection.traitlist[parent][child][value];

          trait.rank = getTraitRank(collection.traitlist[parent][child], value);
        }
      }
    } else {
      if (collection.traitlist[name]) {
        collectionFrequency = collection.traitlist[name][value];

        trait.rank = getTraitRank(collection.traitlist[name], value);
      }
    }

    trait.percent = (collectionFrequency / collection.supply) * 100;

    trait.percent =
      trait.percent === 'NaN' || isNaN(trait.percent)
        ? 0
        : Math.round((trait.percent + Number.EPSILON) * 100) / 100;

    return trait;
  });

  return percentagedTraits;
};

const isObject = (item) => {
  return item && typeof item === 'object' && !Array.isArray(item);
};
/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
const mergeDeep = (target, ...sources) => {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
};

export { isArray, formatTraits, formatNestedTraitForFilter, mergeDeep };

export const data = [];

export const setData = (src) => {
  var temp = [];
  for (var i = 0; i < src.length; i++) {
    if (src[i].name !== null) {
      temp = [
        ...temp,
        {
          id: src[i].id,
          symbol: src[i].name,
          name: src[i].name,
          full_name: src[i].name,
          description: '',
          exchange: 'Jungle',
          type: 'NFT Collection',
          ticker: src[i].policies,
        },
      ];
    }
  }
  data = temp;
};

export const findOne = (policyId) => {
  for (var i = 0; i < data.length; i++) {
    if (data[i].ticker === policyId) {
      return data[i];
    }
  }
  return null;
};

function getCheapestListing(listings) {
  if (!listings) return {};

  listings = Object.values(listings);

  if (listings.length < 1) return {};

  return listings.reduce((acc, curr) =>
    curr?.listing_price < acc?.listing_price ? curr : acc
  );
}

export { getCheapestListing };

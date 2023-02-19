export default function (policyId) {
  if (!policyId || policyId.length < 10) {
    return policyId;
  }
  return (
    policyId.substring(0, 4) +
    '...' +
    policyId.substring(policyId.length - 4, policyId.length)
  );
}

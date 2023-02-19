import Wallet from "components/Wallet";

export async function getServerSideProps(ctx) {
	const { wallet } = ctx.query;

	return {
		props: {
			wallet
		},
	}
}

function WalletPage({wallet}) {
	return (
		<>
			<Wallet wallet={wallet}/>
		</>
	);
}

export default WalletPage;
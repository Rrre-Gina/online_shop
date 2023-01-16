import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from 'react-query';
import '../styles/globals.css';
import { StoreProvider } from '../context/context';

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
	return (
		<QueryClientProvider client={ queryClient }>
			<StoreProvider>
				<Component {...pageProps} />
			</StoreProvider>
		</QueryClientProvider>
	)
}
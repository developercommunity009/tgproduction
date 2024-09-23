import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
// import Routers from './Routers.jsx'

import { createWeb3Modal, defaultConfig } from '@web3modal/ethers5/react'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Screen from './Screen.jsx';
import { SocketProvider } from './Context/SocketContext.jsx'; // Import the SocketProvider
import { Context } from './Context/ContextApi.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// 1. Get projectId
const projectId = '3bc9b13ede2c46a106c03bfadb9129e8'

// 2. Set chains
const chains = [
  {
    chainId: 1, // Ethereum Mainnet
    name: "Ethereum Mainnet",
    currency: "ETH",
    explorerUrl: "https://etherscan.io/",
    rpcUrl: "https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID", // Replace with your Infura or Alchemy project ID
  },
  {
    chainId: 56, // BSC Mainnet
    name: "Binance Smart Chain",
    currency: "BNB",
    explorerUrl: "https://bscscan.com/",
    rpcUrl: "https://bsc-dataseed.binance.org/",
  },
  {
    chainId: 137, // Polygon Mainnet
    name: "Polygon Mainnet",
    currency: "MATIC",
    explorerUrl: "https://polygonscan.com/",
    rpcUrl: "https://polygon-rpc.com/",
  },
]

// 3. Create modal
const metadata = {
  name: 'My Website',
  description: 'My Website description',
  url: 'http://localhost:5173/', // origin must match your domain & subdomain
  icons: ['https://avatars.mywebsite.com/']
}

createWeb3Modal({
  ethersConfig: defaultConfig({ metadata }),
  chains,
  projectId,
  enableAnalytics: true // Optional - defaults to your Cloud configuration
})

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <SocketProvider>
        <BrowserRouter>
          <Context>
            <Screen />
          </Context>
        </BrowserRouter>
      </SocketProvider>
    </QueryClientProvider>
  </React.StrictMode>,

)

)

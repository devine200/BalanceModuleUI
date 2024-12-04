import './connect-wallet.css'
import CloseBtn from '../../close-btn.tsx';
import { ModalFeatures } from "../../types.ts";
import { useState } from 'react';
import metaMask from '../../images/meta_mask.png'


interface ConnectWalletModalProps extends ModalFeatures {}

const ConnectWalletModal = ({closeModal}:ConnectWalletModalProps) => {
    const [ activeNav, setActiveNav ] = useState<any>('Ethereum')
    const navs = [
        {name: 'Ethereum'}, {name: 'Solana'},
        {name: 'Tezos'}, {name: 'Polygon'},
    ]
    const wallets = [
        {name: 'MetaMask', logo: metaMask},
        {name: 'MetaMask', logo: metaMask},
        {name: 'MetaMask', logo: metaMask},
        {name: 'MetaMask', logo: metaMask},
    ]

    return (
        <div className='app-modal connect-modal'>
            <CloseBtn closeModal={closeModal!} />
            <div className="modal-heading">
                <span className="modal-topic">Connect Wallet</span> 
            </div>
            <small>Tradable</small>

            <div className='connect-tags'>
                {navs.map(nav => {
                    return (
                        <span
                        onClick={() => setActiveNav(nav.name)}
                        key={nav.name}
                        className={`${
                            activeNav === nav.name ? 'connect-active' : ''
                        }`}
                        >
                        {nav.name}
                        </span>
                    );
                })}
            </div>

            <div className='connect-details'>
                    {wallets.map((wallet, index) => {
                        return (
                            <div key={index} className="connect-detail">
                                <span>{wallet?.name}</span>
                                <span>
                                    <img src={wallet?.logo} alt={wallet?.name} width={20} />
                                </span>
                            </div>
                        )
                    })}
            </div>
        </div>
    )
}



export default ConnectWalletModal
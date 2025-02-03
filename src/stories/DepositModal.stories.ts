import type { Meta, StoryObj } from '@storybook/react';
import DepositModal from '../components/deposit-modal/DepositModal';
import { ModalState, AssetSelectionTransactionType } from '../types';
import { fn } from '@storybook/test';

// import { WagmiConfig, createClient } from 'wagmi';
// const wagmiClient = createClient({
//     autoConnect: true,
//     connectors: [],
//   });

const meta = {
    title: 'Example/Deposit Modal',
    component: DepositModal,

    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    // decorators: [
    //     (Story: any) => (
    //       <WagmiConfig client={wagmiClient}>
    //         <Story />
    //       </WagmiConfig>
    //     ),
    //   ],
    args: {
        closeModal: fn(),
        changeModal: fn()
    },
} satisfies Meta<typeof DepositModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        selectedChainId: 1,
        assetImage: 'https://via.placeholder.com/50',
        chainImage: 'https://via.placeholder.com/20',
        tokenName: 'USDC',
        tokenAddr: '0x0000000000000000000000000000000000000000',
        moduleId: '0x123456',
        // closeModal: () => console.log('Modal closed'),
        // changeModal: (data: {
        //     modalState: ModalState;
        //     optionalData?: { transactType: AssetSelectionTransactionType };
        // }) => console.log('Modal state changed', data),
    },
};


export const WithoutAssetSelection: Story = {
    args: {
        selectedChainId: 1,
        assetImage: '',
        chainImage: '',
        tokenName: '',
        tokenAddr: '',
        moduleId: '',
        // closeModal: () => console.log('Modal closed'),
        // changeModal: () => console.log('Modal state changed'),
    },
};

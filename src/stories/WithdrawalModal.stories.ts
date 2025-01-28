import type { Meta, StoryObj } from '@storybook/react';
import WithdrawalModal from '../components/withdraw-modal/WithdrawalModal';
import { fn } from '@storybook/test';


const meta = {
    title: 'Example/Withdrawal Modal',
    component: WithdrawalModal,

    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    args: {
        closeModal: fn(),
        changeModal: fn()
    },
} satisfies Meta<typeof WithdrawalModal>;

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
    },
};

import React from 'react';
import { CustomerInquiry } from '../types';
import { CustomTripBuilderModal } from './CustomTripBuilderModal';

interface CallbackModalProps {
  onClose: () => void;
  onSubmitInquiry: (inquiry: CustomerInquiry) => void;
}

export const CallbackModal: React.FC<CallbackModalProps> = ({ onClose, onSubmitInquiry }) => {
  return <CustomTripBuilderModal isOpen={true} onClose={onClose} onSubmitInquiry={onSubmitInquiry} />;
};

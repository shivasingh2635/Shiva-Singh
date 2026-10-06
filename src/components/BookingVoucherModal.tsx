import React from 'react';
import { BookingRecord, Currency } from '../types';
import { AdvancePrintVoucherModal } from './AdvancePrintVoucherModal';

interface BookingVoucherModalProps {
  booking: BookingRecord | null;
  currency: Currency;
  onClose: () => void;
}

export const BookingVoucherModal: React.FC<BookingVoucherModalProps> = ({
  booking,
  currency,
  onClose,
}) => {
  return <AdvancePrintVoucherModal booking={booking} currency={currency} onClose={onClose} />;
};

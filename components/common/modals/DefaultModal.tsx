import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';

type DefaultModalProps = {
  visible: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  singleButton?: boolean;
};

export default function DefaultModal({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = '확인',
  cancelText = '취소',
  singleButton = false,
}: DefaultModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType='fade'
      onRequestClose={onCancel}
    >
      <View className='flex-1 bg-black/60 items-center justify-center px-4'>
        <View className='bg-white rounded-xl items-center justify-center max-w-xs pt-7 pb-1'>
          {title && (
            <Text className='font-bold text-[16px] text-gray-900 mb-2 text-center'>
              {title}
            </Text>
          )}
          <Text className='text-[14px] text-gray-700 text-center mb-5 leading-5'>
            {message}
          </Text>
          <View
            className={
              singleButton
                ? 'flex-row justify-center items-center w-full border-t border-gray-100 mt-0.5'
                : 'flex-row items-center w-full border-t border-gray-100 mt-0.5'
            }
          >
            {!singleButton && (
              <TouchableOpacity
                className='flex-1 py-3 items-center justify-center border-r border-gray-100'
                onPress={onCancel}
                activeOpacity={0.7}
              >
                <Text className='text-[16px] text-gray-900'>{cancelText}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              className='flex-1 py-3 items-center justify-center'
              onPress={onConfirm}
              activeOpacity={0.7}
            >
              <Text className='text-[16px] text-green-600 font-medium'>
                {confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

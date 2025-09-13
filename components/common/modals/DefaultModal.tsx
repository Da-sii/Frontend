import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';

type DefaultModalProps = {
  visible: boolean;
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  singleButton?: boolean;
  secondMessage?: string;
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
  secondMessage,
}: DefaultModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType='fade'
      onRequestClose={onCancel}
    >
      <View className='flex-1 bg-black/60 items-center justify-center px-4'>
        <View className='bg-white rounded-[12px] items-center justify-center max-w-xs pt-7 overflow-hidden'>
          {title && (
            <Text className='font-extrabold text-b-sm text-gray-900 mb-[15px] text-center'>
              {title}
            </Text>
          )}
          <Text className='text-b-sm text-gray-500 font-bold text-center leading-5'>
            {message}
          </Text>
          {secondMessage && (
            <Text className='text-c2 text-gray-500 font-bold text-center'>
              {secondMessage}
            </Text>
          )}
          <View
            className={
              singleButton
                ? 'flex-row justify-center items-center w-full border-t border-gray-100 mt-5'
                : 'flex-row items-center w-full border-t border-gray-100 mt-[22px]'
            }
          >
            {!singleButton && (
              <TouchableOpacity
                className='flex-1  py-[15px] items-center justify-center border-r border-gray-100 active:bg-gray-100'
                onPress={onCancel}
                activeOpacity={0.7}
              >
                <Text className='text-b-md text-gray-500 font-bold'>
                  {cancelText}
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              className='flex-1 py-[15px] items-center justify-center active:bg-gray-100 overflow-hidden'
              onPress={onConfirm}
              activeOpacity={0.7}
            >
              <Text className='text-b-md text-green-600 font-bold'>
                {confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

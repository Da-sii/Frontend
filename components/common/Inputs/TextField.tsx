import React, { useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type TextFieldProps = {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  disabled?: boolean;
};

export const TextField: React.FC<TextFieldProps> = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  disabled = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className='flex-row items-center w-[90%] h-[60px] rounded-xl py-[21px] px-4 border border-gray-200'>
      <TextInput
        className={`flex-1 text-body-sm-r font-normal text-gray-900 ${
          disabled ? "text-gray-400" : "text-black"
        }`}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af" // gray-400
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry && !showPassword}
        editable={!disabled}
      />

      {secureTextEntry && !disabled && (
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            size={20}
            color="#9ca3af"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

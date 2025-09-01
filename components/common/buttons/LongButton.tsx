import React from "react";
import { Text, TouchableOpacity } from "react-native";

type LongButtonProps = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
};

export const LongButton: React.FC<LongButtonProps> = ({ label, onPress, disabled }) => {
  return (

    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={`w-[90%] h-[60px] rounded-xl py-5 items-center 
        ${disabled ? "bg-gray-200" : "bg-green-500 active:bg-green-600"}
      `}
    >
      <Text className="text-white text-b-lg font-extrabold"
       >{label}</Text>
    </TouchableOpacity>

  );
};

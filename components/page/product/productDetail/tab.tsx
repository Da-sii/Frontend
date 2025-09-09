import React from 'react';
import { Pressable, Text, View } from 'react-native';

interface Tab {
  key: string;
  label: string;
}

interface CustomTabsProps {
  tabs: Tab[];
  value: string;
  onChange: (key: string) => void;
}

export default function CustomTabs({ tabs, value, onChange }: CustomTabsProps) {
  return (
    <View className='flex-row border-b border-gray-100 '>
      {tabs.map((tab) => {
        const active = value === tab.key;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onChange(tab.key)}
            className='flex-1 items-center'
          >
            <View>
              <Text
                className={`text-b-lg my-3 mx-1 ${
                  active
                    ? 'text-black font-extrabold text-gray-900'
                    : 'text-gray-400 font-bold'
                }`}
              >
                {tab.label}
              </Text>
              {active && <View className='h-[2px] bg-black ' />}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

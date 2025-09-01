// app/(tabs)/_layout.tsx

import HomeIcon from '@/assets/icons/ic_home.svg';
import PersonIcon from '@/assets/icons/ic_person.svg';
import ShelfIcon from '@/assets/icons/ic_shelf.svg';
import colors from '@/constants/color';
import { Tabs } from 'expo-router';
import { Text } from 'react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.gray[900],
        tabBarInactiveTintColor: colors.gray[400],
      }}
    >
      <Tabs.Screen
        name='category'
        options={{
          title: '카테고리',
          tabBarIcon: ({ focused }) => (
            <ShelfIcon
              width={20}
              height={20}
              color={focused ? colors.gray[900] : colors.gray[400]}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: focused ? colors.gray[900] : colors.gray[400],
                fontSize: 10,
              }}
            >
              카테고리
            </Text>
          ),
        }}
      />

      <Tabs.Screen
        name='home'
        options={{
          title: '홈',
          tabBarIcon: ({ focused }) => (
            <HomeIcon
              width={20}
              height={20}
              color={focused ? colors.gray[900] : colors.gray[400]}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: focused ? colors.gray[900] : colors.gray[400],
                fontSize: 10,
              }}
            >
              홈
            </Text>
          ),
        }}
      />

      <Tabs.Screen
        name='mypage'
        options={{
          title: '마이페이지',
          tabBarIcon: ({ focused }) => (
            <PersonIcon
              width={20}
              height={20}
              color={focused ? colors.gray[900] : colors.gray[400]}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: focused ? colors.gray[900] : colors.gray[400],
                fontSize: 10,
              }}
            >
              마이페이지
            </Text>
          ),
        }}
      />

      <Tabs.Screen
        name='home/ranking'
        options={{
          tabBarButton: () => null,
          tabBarItemStyle: { display: 'none' },
        }}
      />
    </Tabs>
  );
}

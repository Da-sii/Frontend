import {
  default as MoreIcon,
  default as SelectOptionsIcon,
} from '@/assets/icons/ic_arrow_down.svg';
import ArrowLeftIcon from '@/assets/icons/ic_arrow_left.svg';
import LessIcon from '@/assets/icons/ic_arrow_up.svg';
import CheckIcon from '@/assets/icons/ic_check.svg';
import ViewTypeIcon from '@/assets/icons/ic_grid.svg';
import ListTypeIcon from '@/assets/icons/ic_list.svg';
import SearchIcon from '@/assets/icons/ic_magnifier.svg';
import Navigation from '@/components/layout/Navigation';
import TabSwitcher, { TabItem } from '@/components/page/category/TabSwitcher';
import ProductCard from '@/components/page/home/ProductCard';
import RankingItem from '@/components/page/home/RankingItem';
import colors from '@/constants/color';
import { mockRankingData } from '@/mocks/data/home';
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Dimensions, FlatList, Pressable, Text, View } from 'react-native';
import Modal from 'react-native-modal';
import { SafeAreaView } from 'react-native-safe-area-context';

const screenWidth = Dimensions.get('window').width;
const cardWidth = (screenWidth - 16 * 2 - 8 * 2) / 2;

type ListTab =
  | 'sub1'
  | 'sub2'
  | 'sub3'
  | 'sub4'
  | 'sub5'
  | 'sub6'
  | 'sub7'
  | 'sub8'
  | 'sub9';

const listItems: TabItem<ListTab>[] = [
  { key: 'sub1', label: '소분류 1' },
  { key: 'sub2', label: '소분류 2' },
  { key: 'sub3', label: '소분류 3' },
  { key: 'sub4', label: '소분류 4' },
  { key: 'sub5', label: '소분류 5' },
  { key: 'sub6', label: '소분류 6' },
  { key: 'sub7', label: '소분류 7' },
  { key: 'sub8', label: '소분류 8' },
  { key: 'sub9', label: '소분류 9' },
];

const topCategories = [
  { key: 'cat1', label: '대분류1' },
  { key: 'cat2', label: '대분류2' },
  { key: 'cat3', label: '대분류3' },
  { key: 'cat4', label: '대분류4' },
  { key: 'cat5', label: '대분류5' },
  { key: 'cat6', label: '대분류6' },
  { key: 'cat7', label: '대분류7' },
];

export default function List() {
  const router = useRouter();
  const params = useLocalSearchParams<{ main?: string; sub?: string }>();
  const [mainCategory] = useState(params.main ?? '대분류1');
  const [activeSub, setActiveSub] = useState(
    params.sub === 'all' ? 'all' : (params.sub as string),
  );
  const [tab, setTab] = useState<ListTab>(
    activeSub === 'all' ? listItems[0].key : (activeSub as ListTab),
  );
  const itemsWithAll: TabItem<ListTab | 'all'>[] = useMemo(
    () => [{ key: 'all' as const, label: '전체' }, ...listItems],
    [],
  );
  useEffect(() => {
    if (activeSub === 'all') {
      setTab('all' as ListTab);
    } else if (listItems.find((i) => i.key === activeSub)) {
      setTab(activeSub as ListTab);
    }
  }, [activeSub]);

  const sortSheetRef = useRef<BottomSheetModal>(null);

  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [selectedSort, setSelectedSort] = useState<string>('ranking');
  const [filteredProducts] = useState(mockRankingData);
  const [isTopModalVisible, setTopModalVisible] = useState(false);

  const sortOptions = [
    { id: 'ranking', label: '랭킹순' },
    { id: 'new', label: '최신순' },
  ];

  const snapPoints = useMemo(() => ['50%'], []);
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        pressBehavior='close'
      />
    ),
    [],
  );

  const openSortSheet = () => sortSheetRef.current?.present();
  const closeSortSheet = () => sortSheetRef.current?.close();
  const handleSortSelect = (id: string) => {
    setSelectedSort(id);
    closeSortSheet();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Navigation
        left={<ArrowLeftIcon width={20} height={20} fill={colors.gray[900]} />}
        onLeftPress={() => {
          router.back();
          setTopModalVisible(false);
        }}
        center={
          <Pressable
            onPress={() => setTopModalVisible(true)}
            style={{ flexDirection: 'row', alignItems: 'center' }}
          >
            <Text className='text-lg font-semibold mr-1'>{mainCategory} </Text>
            <MoreIcon />
          </Pressable>
        }
        right={
          <Pressable onPress={() => router.push('/home/search')}>
            <SearchIcon width={20} height={20} fill={colors.gray[900]} />
          </Pressable>
        }
      />

      <TabSwitcher
        items={itemsWithAll}
        activeKey={tab}
        onChangeTab={(key) => {
          setTab(key as ListTab);
          setActiveSub(key as string);
          router.replace({
            pathname: '/(tabs)/category/list',
            params: { main: mainCategory, sub: key },
          });
        }}
      />

      <View className='px-4 py-1 mb-2 flex-row justify-between items-center'>
        <Text className='text-sm text-gray-900 font-semibold'>
          총 {filteredProducts.length}개
        </Text>
        <View className='flex-row items-center'>
          <Pressable
            className='flex-row items-center mr-2'
            onPress={openSortSheet}
          >
            <Text className='text-xs text-gray-900 mr-1'>
              {sortOptions.find((opt) => opt.id === selectedSort)?.label}
            </Text>
            <SelectOptionsIcon width={10} height={10} fill={colors.gray[900]} />
          </Pressable>
          <Pressable
            onPress={() => setViewType((v) => (v === 'grid' ? 'list' : 'grid'))}
          >
            {viewType === 'grid' ? (
              <ViewTypeIcon width={16} height={16} />
            ) : (
              <ListTypeIcon width={16} height={16} />
            )}
          </Pressable>
        </View>
      </View>

      {viewType === 'grid' ? (
        <FlatList
          key='grid'
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8 }}
          columnWrapperStyle={{
            justifyContent: 'space-between',
            marginBottom: 16,
          }}
          renderItem={({ item }) => (
            <View style={{ width: cardWidth }}>
              <ProductCard
                item={item}
                style={{ width: cardWidth }}
                imageStyle={{ width: cardWidth, height: cardWidth }}
                titleNumberOfLines={2}
              />
            </View>
          )}
        />
      ) : (
        <FlatList
          key='list'
          data={filteredProducts}
          renderItem={({ item, index }) => (
            <RankingItem item={item} index={index} onPress={() => {}} />
          )}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View className='h-px bg-gray-200' />}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8 }}
        />
      )}

      <Modal
        isVisible={isTopModalVisible}
        animationIn='slideInDown'
        animationOut='slideOutUp'
        backdropOpacity={0.5}
        onBackdropPress={() => setTopModalVisible(false)}
        style={{ margin: 0, justifyContent: 'flex-start' }}
      >
        <View
          style={{
            backgroundColor: '#fff',
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
            paddingTop: 12,
            paddingBottom: 24,
          }}
        >
          <View className='pt-12'>
            <Navigation
              left={
                <ArrowLeftIcon width={20} height={20} fill={colors.gray[900]} />
              }
              onLeftPress={() => {
                router.back();
                setTopModalVisible(false);
              }}
              center={
                <Pressable
                  onPress={() => setTopModalVisible(true)}
                  style={{ flexDirection: 'row', alignItems: 'center' }}
                >
                  <Text className='text-lg font-semibold mr-1'>대분류1 </Text>
                  <LessIcon />
                </Pressable>
              }
              right={
                <Pressable onPress={() => router.push('/home/search')}>
                  <SearchIcon width={20} height={20} fill={colors.gray[900]} />
                </Pressable>
              }
            />
          </View>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {topCategories.map((cat) => (
              <Pressable
                key={cat.key}
                onPress={() => {
                  setTopModalVisible(false);
                }}
                style={{
                  width: '50%',
                  alignItems: 'center',
                  paddingVertical: 12,
                }}
              >
                <Text style={{ fontSize: 16, color: '#333' }}>{cat.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>

      <BottomSheetModal
        ref={sortSheetRef}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        enablePanDownToClose
      >
        <BottomSheetView className='flex-1 px-6 py-4 rounded-2xl'>
          <View className='pb-10'>
            {sortOptions.map((option) => (
              <Pressable
                key={option.id}
                onPress={() => handleSortSelect(option.id)}
                className='flex-row items-center justify-between px-8 py-2'
              >
                <Text
                  className={`text-base ${
                    selectedSort === option.id
                      ? 'text-gray-900 font-semibold'
                      : 'text-gray-500 font-normal'
                  }`}
                >
                  {option.label}
                </Text>
                {selectedSort === option.id && (
                  <CheckIcon width={14} height={14} />
                )}
              </Pressable>
            ))}
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </SafeAreaView>
  );
}

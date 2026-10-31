import ArrowLeftIcon from '@/assets/icons/ic_arrow_left.svg';
import HomeIcon from '@/assets/icons/ic_home.svg';
import Navigation from '@/components/layout/Navigation';
import ProgressTabs from '@/components/page/recommendation/ProgressTabs';
import colors from '@/constants/color';
import { RecommendationSurveyPayload } from '@/services/recommendation';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Question = {
  id: number;
  title: string;
  subtitle?: string;
  options: string[];
  multiple?: boolean;
};

const questions: Question[] = [
  {
    id: 1,
    title: '주요 건강 목표가 무엇인가요?',
    subtitle: '중복 선택 가능해요',
    options: [
      '체지방 감소',
      '근육 증가',
      '피로 회복',
      '면역 강화',
      '소화 개선',
      '혈당 관리',
      '기타',
    ],
    multiple: true,
  },
  {
    id: 2,
    title: '나이대를 알려주세요.',
    options: ['10대', '20대', '30대', '40대', '50대', '60대 이상'],
  },
  {
    id: 3,
    title: '성별을 알려주세요.',
    options: ['여성', '남성', '선택 안 함'],
  },
  {
    id: 4,
    title: '운동을 얼마나 자주 하나요?',
    options: ['거의 안 함', '주 1~2회', '주 3회 이상'],
  },
  {
    id: 5,
    title: '카페인에 민감한 편인가요?',
    options: ['예민한 편', '보통', '상관 없음'],
  },
  {
    id: 6,
    title: '수면은 충분한 편인가요?',
    options: ['8시간 이상', '5~7시간', '1~4시간'],
  },
  {
    id: 7,
    title: '식사는 규칙적으로 하나요?',
    options: ['규칙적', '불규칙적', '다이어트 중 (식이 제한)'],
  },
  {
    id: 8,
    title: '음주 빈도는 어떻게 되나요?',
    options: ['아예 안 하거나 거의 안 함', '주 1~2회', '주 3회 이상'],
  },
  {
    id: 9,
    title: '흡연 여부를 알려주세요.',
    options: ['비흡연', '흡연', '금연 중'],
  },
];

const answerCodeMaps: Record<number, Record<string, string>> = {
  2: {
    '10대': '10s',
    '20대': '20s',
    '30대': '30s',
    '40대': '40s',
    '50대': '50s',
    '60대 이상': '60s+',
  },
  3: { 여성: 'F', 남성: 'M', '선택 안 함': 'N' },
  4: { '거의 안 함': 'none', '주 1~2회': '1_2', '주 3회 이상': '3_plus' },
  5: { '예민한 편': 'sensitive', 보통: 'normal', '상관 없음': 'none' },
  6: { '8시간 이상': '8_plus', '5~7시간': '5_7', '1~4시간': '1_4' },
  7: {
    규칙적: 'regular',
    불규칙적: 'irregular',
    '다이어트 중 (식이 제한)': 'diet',
  },
  8: {
    '아예 안 하거나 거의 안 함': 'none',
    '주 1~2회': '1_2',
    '주 3회 이상': '3_plus',
  },
  9: { 비흡연: 'none', 흡연: 'smoking', '금연 중': 'quitting' },
};

function buildSurveyPayload(
  answers: Record<number, string | string[]>,
): RecommendationSurveyPayload {
  const code = (questionId: number) =>
    answerCodeMaps[questionId][answers[questionId] as string];

  return {
    goals: answers[1] as string[],
    age_range: code(2),
    gender: code(3),
    exercise_frequency: code(4),
    caffeine_sensitivity: code(5),
    sleep_hours: code(6),
    meal_regularity: code(7),
    alcohol_frequency: code(8),
    smoking_status: code(9),
  };
}

function QuestionCard({
  question,
  answer,
  onSelect,
}: {
  question: Question;
  answer?: string | string[];
  onSelect: (option: string) => void;
}) {
  const selectedOptions = Array.isArray(answer)
    ? answer
    : answer
      ? [answer]
      : [];

  return (
    <View
      className='rounded-[20px] bg-white px-[20px] py-[20px]'
      style={{
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.06,
        shadowRadius: 16,
        elevation: 4,
      }}
    >
      <Text className='text-lg text-gray-900 font-n-eb'>
        {question.id}. {question.title}
      </Text>
      {question.subtitle && (
        <Text className='mt-[5px] mb-[16px] ml-[24px] text-gray-400 font-n-bd text-c2'>
          {question.subtitle}
        </Text>
      )}

      {question.multiple ? (
        <View className='flex-row flex-wrap gap-x-[13px] gap-y-[8px] '>
          {question.options.map((option) => {
            const isSelected = selectedOptions.includes(option);
            return (
              <Pressable
                key={option}
                onPress={() => onSelect(option)}
                className={`h-[32px] items-center justify-center rounded-[30px] border px-[18px]  ${
                  isSelected
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <Text
                  className={`font-n-bd text-sm ${
                    isSelected ? 'text-green-600' : 'text-gray-700'
                  }`}
                >
                  {option}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ) : (
        <View className='mt-[16px]'>
          {question.options.map((option, index) => {
            const isSelected = answer === option;
            const isLast = index === question.options.length - 1;
            return (
              <Pressable
                key={option}
                onPress={() => onSelect(option)}
                className={`h-[48px] flex-row items-center rounded-[14px] border-[2px] px-[16px] ${
                  !isLast ? 'mb-[8px]' : ''
                } ${
                  isSelected
                    ? 'border-green-400 bg-green-50'
                    : 'border-gray-100 bg-white'
                }`}
              >
                <View
                  className={`h-[20px] w-[20px] items-center justify-center rounded-full border-[2px] ${
                    isSelected ? 'border-green-500' : 'border-gray-100'
                  }`}
                >
                  {isSelected && (
                    <View className='h-[13px] w-[13px] rounded-full bg-green-500' />
                  )}
                </View>
                <Text
                  className={`ml-[12px] font-n-bd text-sm ${
                    isSelected ? 'text-green-700' : 'text-gray-700'
                  }`}
                >
                  {option}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

export default function RecommendationSurveyPage() {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const questionOffsets = useRef<Record<number, number>>({});
  const pendingScrollQuestionId = useRef<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const answersRef = useRef<Record<number, string | string[]>>({});
  const [visibleCount, setVisibleCount] = useState(
    questions[0].multiple ? 2 : 1,
  );
  const activeStep: 1 | 2 | 3 = visibleCount >= 4 ? 2 : 1;

  const hasAnswer = (question: Question) => {
    const answer = answersRef.current[question.id];
    return Array.isArray(answer) ? answer.length > 0 : !!answer;
  };

  const handleSelect = (question: Question, option: string) => {
    const currentAnswers = answersRef.current;
    let nextAnswers: Record<number, string | string[]>;

    if (question.multiple) {
      const currentOptions =
        (currentAnswers[question.id] as string[] | undefined) ?? [];

      if (currentOptions.length === 1 && currentOptions.includes(option)) {
        nextAnswers = currentAnswers;
      } else {
        const nextOptions = currentOptions.includes(option)
          ? currentOptions.filter((item) => item !== option)
          : [...currentOptions, option];
        nextAnswers = { ...currentAnswers, [question.id]: nextOptions };
      }
    } else {
      nextAnswers = { ...currentAnswers, [question.id]: option };
    }

    answersRef.current = nextAnswers;
    setAnswers(nextAnswers);

    const currentQuestion = questions[visibleCount - 1];
    const canAdvance =
      currentQuestion &&
      !currentQuestion.multiple &&
      visibleCount < questions.length &&
      hasAnswer(currentQuestion) &&
      questions.slice(0, visibleCount - 1).every(hasAnswer);

    if (canAdvance) {
      pendingScrollQuestionId.current = currentQuestion.id + 1;
      setVisibleCount((current) => {
        const nextQuestion = questions[current];
        const countToReveal = nextQuestion?.multiple ? 2 : 1;
        return Math.min(current + countToReveal, questions.length);
      });
    }
  };

  const scrollToPendingQuestion = () => {
    const questionId = pendingScrollQuestionId.current;
    const y = questionId ? questionOffsets.current[questionId] : undefined;

    if (y === undefined) return;

    pendingScrollQuestionId.current = null;
    requestAnimationFrame(() => {
      // 다음 카드의 맨 위가 헤더에 붙지 않도록, 이전 질문 아래 여백만큼 남긴다.
      scrollViewRef.current?.scrollTo({
        y: Math.max(0, y - 29),
        animated: true,
      });
    });
  };

  return (
    <SafeAreaView className='flex-1 bg-white' edges={['top', 'left', 'right']}>
      <Navigation
        title='맞춤 분석'
        left={<ArrowLeftIcon width={18} height={18} fill={colors.gray[900]} />}
        onLeftPress={() => router.back()}
        right={<HomeIcon width={18} height={18} fill={colors.gray[900]} />}
        onRightPress={() => router.replace('/(tabs)/home')}
      />
      <ProgressTabs activeStep={activeStep} />

      <ScrollView
        ref={scrollViewRef}
        className='flex-1 bg-white'
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 20,
          paddingBottom: 480,
        }}
        onContentSizeChange={scrollToPendingQuestion}
        showsVerticalScrollIndicator={false}
      >
        {questions.slice(0, visibleCount).map((question) => (
          <View
            key={question.id}
            onLayout={({ nativeEvent }) => {
              questionOffsets.current[question.id] = nativeEvent.layout.y;
              scrollToPendingQuestion();
            }}
          >
            {question.id === 1 && (
              <View className='mb-[20px] flex-row items-center gap-x-[14px]'>
                <Text className='text-green-500 font-n-eb text-c2'>
                  기본 정보
                </Text>
                <View className='flex-1 h-px bg-green-100' />
              </View>
            )}
            {question.id === 4 && (
              <View className='mb-[20px] flex-row items-center gap-x-[14px]'>
                <Text className='text-green-500 font-n-eb text-c2'>
                  생활 습관
                </Text>
                <View className='flex-1 h-px bg-green-100' />
              </View>
            )}
            {/* TODO: 설문 전반에서 재사용할 수 있도록 SurveyQuestionCard 컴포넌트로 분리 */}
            <View>
              <QuestionCard
                question={question}
                answer={answers[question.id]}
                onSelect={(option) => handleSelect(question, option)}
              />
            </View>
            {question.id !== visibleCount && <View className='h-[29px]' />}
          </View>
        ))}

        {visibleCount === questions.length && !!answers[9] && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              router.push({
                pathname: '/recommendation/loading',
                params: { survey: JSON.stringify(buildSurveyPayload(answers)) },
              } as never)
            }
            className='mt-[30px] py-[12px] items-center justify-center rounded-[12px] bg-green-500 '
          >
            <Text className='text-lg text-white font-n-eb '>결과 확인하기</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

import ChekckIcon from '@/assets/icons/auth/ic_green_check.svg';
import XIcon from '@/assets/icons/auth/ic_red_x.svg';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardTypeOptions,
} from 'react-native';

type TextFieldProps = {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  disabled?: boolean;

  // 메시지
  firstMessage?: string;
  secondMessage?: string;

  // (신규) 내부 검증 사용 시: 메뉴 & 검증 함수
  menu?: 1 | 2;
  validateFirst?: (text: string) => boolean;
  validateSecond?: (text: string) => boolean;
  keyboardType?: KeyboardTypeOptions;
};

export const TextField: React.FC<TextFieldProps> = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  disabled = false,

  firstMessage,
  secondMessage,

  // 신규 내부 검증
  menu,
  validateFirst,
  validateSecond,
  keyboardType,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  // 내부 검증을 쓸지 여부(메뉴/검증함수 제공 시 내부 검증 사용)
  const useInternalValidation = !!menu && (!!validateFirst || !!validateSecond);

  // menu=2에서 blur/submit 전에는 메시지 숨기기 위한 상태
  const [touched, setTouched] = useState(false);

  // 내부 유효성 계산
  const computedFirstValid = useMemo(() => {
    if (!useInternalValidation || !validateFirst) return undefined;
    if (menu === 1) {
      // 입력 시작 후 실시간 반영
      return value.length === 0 ? undefined : validateFirst(value);
    } else {
      // menu === 2
      if (!touched) return undefined; // blur/submit 전에는 판단 안 함
      return validateFirst(value);
    }
  }, [useInternalValidation, validateFirst, value, touched, menu]);

  const computedSecondValid = useMemo(() => {
    if (!useInternalValidation || !validateSecond) return undefined;
    if (menu === 1) {
      return value.length === 0 ? undefined : validateSecond(value);
    } else {
      if (!touched) return undefined;
      return validateSecond(value);
    }
  }, [useInternalValidation, validateSecond, value, touched, menu]);

  // 메시지/아이콘 노출 조건 계산
  const shouldShowFirst = useMemo(() => {
    if (!firstMessage) return false;

    if (menu === 1) {
      // 항상 노출 (입력 전에는 회색 상태)
      return true;
    } else {
      // menu === 2: blur/submit 이후 "유효하지 않을 때만" 노출
      if (!touched) return false;
      // validateFirst 없으면 그냥 touched 후엔 보이게 유지
      if (!validateFirst) return true;
      return computedFirstValid === false; // ❗ 유효하면 숨김
    }
  }, [
    firstMessage,
    useInternalValidation,

    menu,
    touched,
    validateFirst,
    computedFirstValid,
  ]);

  const shouldShowSecond = useMemo(() => {
    if (!secondMessage) return false;

    if (menu === 1) {
      return true;
    } else {
      // menu === 2: blur/submit 이후 "유효하지 않을 때만" 노출
      if (!touched) return false;
      if (!validateSecond) return true;
      return computedSecondValid === false; // ❗ 유효하면 숨김
    }
  }, [
    secondMessage,
    useInternalValidation,
    menu,
    touched,
    validateSecond,
    computedSecondValid,
  ]);

  // 실제 표시할 유효/색상/아이콘 결정 (first)
  const firstState = useMemo(() => {
    // 내부 검증 사용
    if (useInternalValidation) {
      if (menu === 1) {
        if (value.length === 0) {
          // 초기: 회색 + 회색 체크
          return { color: 'text-gray-400', icon: 'gray' as const };
        }
        // 입력 중: 유효/무효 반영
        if (computedFirstValid === true) {
          return { color: 'text-green-500', icon: 'green' as const };
        }
        if (computedFirstValid === false) {
          return { color: 'text-red-500', icon: 'red' as const };
        }
        // 미정
        return { color: 'text-gray-400', icon: 'gray' as const };
      } else {
        // menu === 2
        if (!touched) {
          // blur 전에는 메시지 감춤(shouldShowFirst=false)이 일반적이지만,
          // 혹시 UI에서 공간 유지를 원하면 회색처리로 바꿔도 됨
          return { color: 'text-gray-400', icon: 'gray' as const };
        }
        if (computedFirstValid === true) {
          return { color: 'text-green-500', icon: 'green' as const };
        }
        if (computedFirstValid === false) {
          return { color: 'text-red-500', icon: 'red' as const };
        }
        return { color: 'text-gray-400', icon: 'gray' as const };
      }
    }

    // 초기값(정해지지 않음)
    return { color: 'text-gray-400', icon: 'gray' as const };
  }, [useInternalValidation, menu, value.length, computedFirstValid, touched]);

  // 실제 표시할 유효/색상/아이콘 결정 (second)
  const secondState = useMemo(() => {
    if (useInternalValidation) {
      if (menu === 1) {
        if (value.length === 0)
          return { color: 'text-gray-400', icon: 'gray' as const };
        if (computedSecondValid === true)
          return { color: 'text-green-500', icon: 'green' as const };
        if (computedSecondValid === false)
          return { color: 'text-red-500', icon: 'red' as const };
        return { color: 'text-gray-400', icon: 'gray' as const };
      } else {
        if (!touched) return { color: 'text-gray-400', icon: 'gray' as const };
        if (computedSecondValid === true)
          return { color: 'text-green-500', icon: 'green' as const };
        if (computedSecondValid === false)
          return { color: 'text-red-500', icon: 'red' as const };
        return { color: 'text-gray-400', icon: 'gray' as const };
      }
    }

    return { color: 'text-gray-400', icon: 'gray' as const };
  }, [useInternalValidation, menu, value.length, computedSecondValid, touched]);

  // 이벤트 핸들러
  const handleChangeText = (text: string) => {
    onChangeText(text.replace(/\s/g, ''));
    // menu=1은 실시간 반영, menu=2는 touched 이후부터 실시간 갱신
    if (useInternalValidation && menu === 2 && touched) {
      // blur 이후에만 실시간 업데이트
      // computed 값은 useMemo에서 value 의존으로 자동 갱신됨
    }
  };

  const handleBlur = () => {
    if (useInternalValidation && menu === 2) {
      setTouched(true);
    }
  };

  const handleSubmitEditing = () => {
    if (useInternalValidation && menu === 2) {
      setTouched(true);
    }
  };

  // 테두리 색상(옵션)
  // 테두리 색상
  const borderColorClass = useMemo(() => {
    // menu=2: 유효해도 테두리는 '회색'
    if (menu === 2) {
      if (!touched) return 'border-gray-200';

      const firstCheck =
        firstMessage && validateFirst ? computedFirstValid : undefined;
      const secondCheck =
        secondMessage && validateSecond ? computedSecondValid : undefined;

      // 하나라도 invalid면 빨강
      if (firstCheck === false || secondCheck === false)
        return 'border-red-400';

      // valid(모두 true) 이거나 판단 불가(undefined)라면 회색 유지
      return 'border-gray-200';
    }

    // menu=1: 기존처럼 valid면 초록, invalid면 빨강
    const anyInvalid =
      (firstMessage && computedFirstValid === false) ||
      (secondMessage && computedSecondValid === false);

    const anyValid =
      (firstMessage && computedFirstValid === true) ||
      (secondMessage && computedSecondValid === true);

    if (anyInvalid) return 'border-red-400';
    if (anyValid) return 'border-green-400';
    return 'border-gray-200';
  }, [
    useInternalValidation,
    menu,
    touched,
    firstMessage,
    secondMessage,
    validateFirst,
    validateSecond,
    computedFirstValid,
    computedSecondValid,
  ]);

  const renderIcon = (kind: 'gray' | 'green' | 'red') => {
    if (kind === 'green') return <ChekckIcon />;
    if (kind === 'red') return <XIcon />;
    // gray
    return <Ionicons name='checkmark' size={12} color='#9ca3af' />;
  };

  return (
    <View>
      <View
        className={`flex-row items-center w-full h-[60px] rounded-xl py-[21px] px-4 border ${borderColorClass} ${disabled ? 'bg-gray-50' : ''}`}
      >
        <TextInput
          className={`flex-1 text-b-sm font-bold text-gray-900 ${disabled ? 'text-gray-400' : ''}`}
          value={value}
          onChangeText={handleChangeText}
          onBlur={handleBlur}
          onSubmitEditing={handleSubmitEditing}
          secureTextEntry={secureTextEntry && !showPassword}
          editable={!disabled}
          placeholder={placeholder}
          placeholderTextColor='#9ca3af'
          returnKeyType='done'
          blurOnSubmit
          keyboardType={keyboardType}
        />

        {secureTextEntry && !disabled && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye-off' : 'eye'}
              size={20}
              color='#9ca3af'
            />
          </TouchableOpacity>
        )}
      </View>

      <View className='flex-row items-center mt-2'>
        {shouldShowFirst && firstMessage && (
          <View className='flex-row items-center'>
            <Text
              className={`text-c2 font-bold ml-[17px] mr-[2px] ${firstState.color}`}
            >
              {firstMessage}
            </Text>
            {renderIcon(firstState.icon)}
          </View>
        )}

        {shouldShowSecond && secondMessage && (
          <View className='flex-row items-center'>
            <Text
              className={`text-c2 font-bold ml-[15px] mr-[2px] ${secondState.color}`}
            >
              {secondMessage}
            </Text>
            {renderIcon(secondState.icon)}
          </View>
        )}
      </View>
    </View>
  );
};

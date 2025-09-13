import { TERMS } from '@/constants/terms';
import { ScrollView, Text, TouchableOpacity } from 'react-native';

export default function TermsListScreen({ navigation }: { navigation: any }) {
  return (
    <ScrollView style={{ padding: 16 }}>
      {TERMS.map((term) => (
        <TouchableOpacity
          key={term.id}
          onPress={() => navigation.navigate('TermsDetail', { term })}
          style={{
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderColor: '#ddd',
          }}
        >
          <Text style={{ fontSize: 16 }}>{term.title}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

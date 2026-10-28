import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CATEGORIES, Category, PRIORITIES, Priority, RootStackParamList } from '../types';
import { useTasks } from '../context/TaskContext';
import ScreenHeader from '../components/ScreenHeader';
import AppButton from '../components/AppButton';
import { PRIORITY_COLORS } from '../components/Badges';
import { colors, fonts, radius, shadow, spacing } from '../theme/colors';
import { formatDate, formatDateInput, getToday, validateDueDate } from '../utils/date';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskForm'>;

const MAX_TITLE = 50;

export default function TaskFormScreen({ navigation, route }: Props) {
  const { tasks, addTask, updateTask } = useTasks();
  const insets = useSafeAreaInsets();

  // Có taskId => đang sửa, không có => thêm mới
  const editingTask = tasks.find(task => task.id === route.params?.taskId);
  const isEdit = editingTask !== undefined;

  // Khi sửa thì điền sẵn dữ liệu cũ
  const [title, setTitle] = useState(editingTask?.title ?? '');
  const [note, setNote] = useState(editingTask?.note ?? '');
  const [category, setCategory] = useState<Category>(editingTask?.category ?? 'Học tập');
  const [priority, setPriority] = useState<Priority>(editingTask?.priority ?? 'Trung bình');
  const [dueDate, setDueDate] = useState(editingTask?.dueDate ?? '');

  const [titleError, setTitleError] = useState('');
  const [dateError, setDateError] = useState('');

  function validateTitle(text: string): string {
    if (text.trim() === '') {
      return 'Vui lòng nhập tên công việc';
    }
    if (text.trim().length > MAX_TITLE) {
      return `Tên công việc tối đa ${MAX_TITLE} ký tự`;
    }
    return '';
  }

  function handleSave() {
    // Khi thêm mới thì hạn không được trước hôm nay
    const newTitleError = validateTitle(title);
    const newDateError = validateDueDate(dueDate, !isEdit);
    setTitleError(newTitleError);
    setDateError(newDateError);
    if (newTitleError || newDateError) {
      return;
    }

    const data = { title: title.trim(), note: note.trim(), category, priority, dueDate };
    if (isEdit) {
      updateTask(editingTask.id, data);
    } else {
      addTask(data);
    }
    navigation.goBack();
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView style={styles.flex} behavior="padding">
        <ScreenHeader
          title={isEdit ? 'Sửa công việc' : 'Thêm công việc'}
          subtitle={editingTask?.title}
          onBack={() => navigation.goBack()}
        />

        <ScrollView
          contentContainerStyle={styles.form}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Thẻ 1: thông tin công việc */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Thông tin công việc</Text>
            <Text style={styles.cardSubtitle}>Các ô có dấu * là bắt buộc</Text>

            {/* Tên công việc */}
            <Text style={styles.label}>
              Tên công việc <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, titleError !== '' && styles.inputError]}
              placeholder="VD: Ôn tập chương 3"
              placeholderTextColor={colors.disabledText}
              value={title}
              onChangeText={text => {
                setTitle(text);
                if (titleError) {
                  setTitleError(validateTitle(text));
                }
              }}
              returnKeyType="next"
            />
            <View style={styles.helperRow}>
              <Text style={styles.errorText}>{titleError ? `ⓘ ${titleError}` : ''}</Text>
              <Text
                style={[styles.counter, title.trim().length > MAX_TITLE && styles.counterError]}
              >
                {title.trim().length}/{MAX_TITLE}
              </Text>
            </View>

            {/* Hạn hoàn thành */}
            <Text style={styles.label}>
              Hạn hoàn thành <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, dateError !== '' && styles.inputError]}
              placeholder="dd/mm/yyyy"
              placeholderTextColor={colors.disabledText}
              value={dueDate}
              onChangeText={text => {
                const formatted = formatDateInput(text);
                setDueDate(formatted);
                if (dateError) {
                  setDateError(validateDueDate(formatted, !isEdit));
                }
              }}
              keyboardType="number-pad"
              maxLength={10}
            />
            {dateError ? (
              <Text style={styles.errorText}>ⓘ {dateError}</Text>
            ) : (
              <Text style={styles.hint}>
                {isEdit
                  ? 'Dấu "/" được tự chèn khi gõ'
                  : `Không được trước hôm nay (${formatDate(getToday())})`}
              </Text>
            )}

            {/* Ghi chú */}
            <Text style={[styles.label, styles.labelGap]}>
              Ghi chú <Text style={styles.optional}>(không bắt buộc)</Text>
            </Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Thêm mô tả, đường dẫn tài liệu..."
              placeholderTextColor={colors.disabledText}
              value={note}
              onChangeText={setNote}
              multiline
              textAlignVertical="top"
            />
          </View>

          {/* Thẻ 2: phân loại */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Phân loại</Text>
            <Text style={styles.cardSubtitle}>Chọn danh mục và mức ưu tiên</Text>

            {/* Danh mục */}
            <Text style={styles.label}>Danh mục</Text>
            <View style={styles.categoryGrid}>
              {CATEGORIES.map(item => {
                const active = category === item;
                return (
                  <Pressable
                    key={item}
                    onPress={() => setCategory(item)}
                    style={({ pressed }) => [
                      styles.categoryButton,
                      active && styles.categoryActive,
                      pressed && !active && styles.optionPressed,
                    ]}
                  >
                    <Text style={[styles.optionText, active && styles.categoryTextActive]}>
                      {item}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Mức ưu tiên */}
            <Text style={[styles.label, styles.labelGap]}>Mức ưu tiên</Text>
            <View style={styles.priorityRow}>
              {PRIORITIES.map(item => {
                const active = priority === item;
                const color = PRIORITY_COLORS[item];
                return (
                  <Pressable
                    key={item}
                    onPress={() => setPriority(item)}
                    style={({ pressed }) => [
                      styles.priorityButton,
                      active && { backgroundColor: color.background, borderColor: color.dot },
                      pressed && !active && styles.optionPressed,
                    ]}
                  >
                    <View style={[styles.priorityDot, { backgroundColor: color.dot }]} />
                    <Text style={[styles.optionText, active && { color: color.text }]}>
                      {item}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </ScrollView>

        {/* Thanh nút dưới cùng */}
        <View style={[styles.bottomBar, { paddingBottom: insets.bottom + spacing.md }]}>
          <View style={styles.cancelButton}>
            <AppButton title="Huỷ" variant="outline" onPress={() => navigation.goBack()} />
          </View>
          <View style={styles.saveButton}>
            <AppButton
              title={isEdit ? 'Lưu thay đổi' : 'Lưu công việc'}
              variant="dark"
              onPress={handleSave}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  form: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xxl,
  },

  // Thẻ chứa nhóm ô nhập
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    ...shadow,
  },
  cardTitle: {
    ...fonts.title,
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  cardSubtitle: {
    ...fonts.caption,
    color: colors.textMuted,
    marginTop: 2,
    marginBottom: spacing.sm,
  },

  label: {
    ...fonts.body,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  labelGap: {
    marginTop: spacing.lg,
  },
  required: {
    color: colors.danger,
  },
  optional: {
    fontWeight: '400',
    color: colors.textMuted,
  },
  input: {
    ...fonts.body,
    color: colors.text,
    backgroundColor: '#F6F8F7',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    height: 50,
  },
  inputError: {
    borderColor: colors.danger,
    backgroundColor: '#FFF7F7',
  },
  textArea: {
    height: 90,
    paddingTop: spacing.md,
  },
  helperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  errorText: {
    ...fonts.caption,
    color: colors.danger,
    flex: 1,
    marginTop: spacing.xs,
  },
  counter: {
    ...fonts.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  counterError: {
    color: colors.danger,
    fontWeight: '700',
  },
  hint: {
    ...fonts.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },

  // Nút chọn danh mục / ưu tiên
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryButton: {
    width: '48.5%',
    height: 46,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#F6F8F7',
    marginBottom: spacing.sm,
  },
  categoryActive: {
    backgroundColor: colors.text,
    borderColor: colors.text,
  },
  categoryTextActive: {
    color: colors.accent,
    fontWeight: '700',
  },
  optionPressed: {
    backgroundColor: colors.border,
  },
  optionText: {
    ...fonts.body,
    fontWeight: '600',
    color: colors.text,
  },
  priorityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priorityButton: {
    flex: 1,
    height: 44,
    marginHorizontal: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.xl,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: '#F6F8F7',
  },
  priorityDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    marginRight: 6,
  },

  // Thanh nút dưới
  bottomBar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    ...shadow,
  },
  cancelButton: {
    flex: 1,
    marginRight: spacing.md,
  },
  saveButton: {
    flex: 2,
  },
});

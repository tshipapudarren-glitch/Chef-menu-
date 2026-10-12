import { useMemo, useState } from 'react';
import type { ReactElement } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { CourseType, MenuItem } from './src/types';

const courseTypes: CourseType[] = ['Starter', 'Main Course', 'Dessert'];
const initialMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Beef Carpaccio',
    description: 'Thinly sliced beef tenderloin topped with rocket, capers, shaved parmesan, and a drizzling of extra virgin olive oil.',
    course: 'Starter',
    price: 115,
  },
  {
    id: '2',
    name: 'Creamy Mushroom Soup',
    description: 'Rich wild mushroom cream soup infused with fresh thyme and served with toasted garlic baguette slices.',
    course: 'Starter',
    price: 85,
  },
  {
    id: '3',
    name: 'Pan-Seared Salmon',
    description: 'Fresh Norwegian salmon fillet served on a bed of dill mashed potatoes, grilled asparagus, and lemon butter sauce.',
    course: 'Main Course',
    price: 245,
  },
  {
    id: '4',
    name: 'Classic Ribeye Steak',
    description: '300g grain-fed aged ribeye cooked to preference, accompanied by rustic cut fries and mushroom pepper sauce.',
    course: 'Main Course',
    price: 290,
  },
  {
    id: '5',
    name: 'Chocolate Fondant',
    description: 'Warm molten chocolate cake with a gooey center, paired with artisanal Madagascar vanilla bean ice cream.',
    course: 'Dessert',
    price: 95,
  },
  {
    id: '6',
    name: 'Vanilla Bean Crème Brûlée',
    description: 'Classic silky French custard topped with a hard caramelized sugar shell and fresh berries.',
    course: 'Dessert',
    price: 80,
  },
];

function App() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<CourseType | 'All'>('All');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [notification, setNotification] = useState('');

  const filteredMenuItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return menuItems.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(query)
        || item.description.toLowerCase().includes(query);
      const matchesCourse = selectedCourse === 'All' || item.course === selectedCourse;
      return matchesSearch && matchesCourse;
    });
  }, [menuItems, searchQuery, selectedCourse]);

  const averagePrice = menuItems.length === 0
    ? 0
    : menuItems.reduce((total, item) => total + item.price, 0) / menuItems.length;

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingItem(null);
  };

  const openForm = (item: MenuItem | null = null) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const saveItem = (item: MenuItem) => {
    if (editingItem) {
      setMenuItems((items) => items.map((existing) => (
        existing.id === item.id ? item : existing
      )));
      setNotification('Dish updated successfully.');
    } else {
      setMenuItems((items) => [...items, item]);
      setNotification('Dish added to the menu.');
    }
    closeForm();
  };

  const deleteItem = (id: string) => {
    setMenuItems((items) => items.filter((item) => item.id !== id));
    setNotification('Dish deleted from the menu.');
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCourse('All');
  };

  const listHeader = (
    <View>
      <View style={styles.topBar}>
        <View style={styles.brandMark}><Text style={styles.brandMarkText}>CM</Text></View>
        <Text style={styles.brandName}>Chef&apos;s Menu Manager</Text>
      </View>

      {notification !== '' && (
        <View style={styles.notice} accessibilityLiveRegion="polite">
          <Text style={styles.noticeText}>{notification}</Text>
          <Pressable
            onPress={() => setNotification('')}
            accessibilityRole="button"
            accessibilityLabel="Dismiss notification"
            hitSlop={8}
          >
            <Text style={styles.dismissText}>×</Text>
          </Pressable>
        </View>
      )}

      <View style={styles.hero}>
        <Text style={styles.eyebrow}>KITCHEN WORKSPACE</Text>
        <Text style={styles.title}>Your menu,{'\n'}in its prime.</Text>
        <Text style={styles.heroCopy}>Shape a considered menu, keep every course balanced, and make every dish count.</Text>
        <Pressable style={styles.primaryButton} onPress={() => openForm()}>
          <Text style={styles.primaryButtonText}>＋  Add a dish</Text>
        </Pressable>
      </View>

      <View style={styles.statsCard}>
        <View style={styles.mainStat}>
          <Text style={styles.statLabel}>TOTAL DISHES</Text>
          <Text style={styles.mainStatValue}>{menuItems.length}</Text>
          <Text style={styles.statNote}>Across your menu</Text>
        </View>
        <View style={styles.averageStat}>
          <Text style={styles.statLabel}>AVERAGE PRICE</Text>
          <Text style={styles.averageStatValue}>${averagePrice.toFixed(2)}</Text>
          <Text style={styles.statNote}>Per menu item</Text>
        </View>
        <View style={styles.courseStats}>
          <Text style={styles.statLabel}>COURSE BALANCE</Text>
          <View style={styles.courseStatRow}>
            {courseTypes.map((course) => (
              <Text style={styles.courseStat} key={course}>
                <Text style={styles.courseStatValue}>
                  {menuItems.filter((item) => item.course === course).length}
                </Text>
                {' '}{course === 'Main Course' ? 'mains' : `${course.toLowerCase()}s`}
              </Text>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.menuHeading}>
        <View>
          <Text style={styles.eyebrow}>YOUR COLLECTION</Text>
          <Text style={styles.sectionTitle}>Menu dishes</Text>
        </View>
        <Text style={styles.itemCount}>{filteredMenuItems.length}</Text>
      </View>
      <Text style={styles.sectionDescription}>A living list of everything ready for service.</Text>

      <TextInput
        accessibilityLabel="Search dishes"
        style={styles.searchInput}
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search by dish or ingredient"
        placeholderTextColor={colors.muted}
        returnKeyType="search"
      />
      <View style={styles.filters} accessibilityRole="radiogroup" accessibilityLabel="Filter by course">
        {(['All', ...courseTypes] as Array<CourseType | 'All'>).map((course) => {
          const isSelected = selectedCourse === course;
          return (
            <Pressable
              key={course}
              style={[styles.filterButton, isSelected && styles.filterButtonSelected]}
              onPress={() => setSelectedCourse(course)}
              accessibilityRole="radio"
              accessibilityState={{ checked: isSelected }}
            >
              <Text style={[styles.filterText, isSelected && styles.filterTextSelected]}>{course}</Text>
            </Pressable>
          );
        })}
      </View>
      {(searchQuery !== '' || selectedCourse !== 'All') && (
        <Pressable style={styles.clearButton} onPress={clearFilters}>
          <Text style={styles.clearButtonText}>Clear filters</Text>
        </Pressable>
      )}
      <Text style={styles.listLabel}>DISHES ON THE MENU</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <FlatList
        data={filteredMenuItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MenuCard item={item} onEdit={() => openForm(item)} onDelete={() => deleteItem(item.id)} />
        )}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>✳</Text>
            <Text style={styles.emptyTitle}>
              {menuItems.length === 0 ? 'Your menu is ready to begin' : 'No dishes found'}
            </Text>
            <Text style={styles.emptyCopy}>
              {menuItems.length === 0
                ? 'Add your first dish to start building the menu.'
                : 'Try a different search or clear the current filters.'}
            </Text>
            {menuItems.length === 0 ? (
              <Pressable style={styles.secondaryButton} onPress={() => openForm()}>
                <Text style={styles.secondaryButtonText}>Add your first dish</Text>
              </Pressable>
            ) : (
              <Pressable style={styles.secondaryButton} onPress={clearFilters}>
                <Text style={styles.secondaryButtonText}>Clear filters</Text>
              </Pressable>
            )}
          </View>
        }
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
      />
      {isFormOpen && (
        <DishForm
          key={editingItem?.id ?? 'new-dish'}
          item={editingItem}
          visible={isFormOpen}
          onClose={closeForm}
          onSubmit={saveItem}
        />
      )}
    </SafeAreaView>
  );
}

interface MenuCardProps {
  item: MenuItem;
  onEdit: () => void;
  onDelete: () => void;
}

function MenuCard({ item, onEdit, onDelete }: MenuCardProps) {
  return (
    <View style={styles.menuCard}>
      <View style={[styles.courseMarker, item.course === 'Main Course' && styles.mainMarker, item.course === 'Dessert' && styles.dessertMarker]} />
      <View style={styles.dishContent}>
        <View style={styles.dishTopline}>
          <Text style={styles.courseName}>{item.course.toUpperCase()}</Text>
          <Text style={styles.price}>${item.price.toFixed(2)}</Text>
        </View>
        <Text style={styles.dishName}>{item.name}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <View style={styles.actions}>
          <Pressable style={styles.actionButton} onPress={onEdit} accessibilityRole="button">
            <Text style={styles.actionText}>Edit</Text>
          </Pressable>
          <Pressable style={styles.deleteButton} onPress={onDelete} accessibilityRole="button">
            <Text style={styles.deleteText}>Delete</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

interface DishFormProps {
  item: MenuItem | null;
  visible: boolean;
  onClose: () => void;
  onSubmit: (item: MenuItem) => void;
}

function DishForm({ item, visible, onClose, onSubmit }: DishFormProps) {
  const [name, setName] = useState(item?.name ?? '');
  const [description, setDescription] = useState(item?.description ?? '');
  const [course, setCourse] = useState<CourseType>(item?.course ?? 'Starter');
  const [price, setPrice] = useState(item?.price.toString() ?? '');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const trimmedName = name.trim();
    const trimmedDescription = description.trim();
    const parsedPrice = Number(price);

    if (!trimmedName) {
      setError('Enter a dish name.');
      return;
    }
    if (!trimmedDescription) {
      setError('Enter a description.');
      return;
    }
    if (price.trim() === '' || !Number.isFinite(parsedPrice) || parsedPrice < 0) {
      setError('Enter a valid price of zero or more.');
      return;
    }

    setError('');
    onSubmit({
      id: item?.id ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: trimmedName,
      description: trimmedDescription,
      course,
      price: parsedPrice,
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.modalBackdrop}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.modalCard}>
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.formContent}>
            <View style={styles.formHeading}>
              <View>
                <Text style={styles.eyebrow}>{item ? 'REFINE DISH' : 'NEW ADDITION'}</Text>
                <Text style={styles.formTitle}>{item ? 'Edit dish' : 'Add a dish'}</Text>
              </View>
              <Pressable
                onPress={onClose}
                accessibilityRole="button"
                accessibilityLabel="Close form"
                hitSlop={10}
              >
                <Text style={styles.closeText}>×</Text>
              </Pressable>
            </View>

            {error !== '' && <Text style={styles.formError} accessibilityRole="alert">{error}</Text>}

            <FieldLabel title="Dish name">
              <TextInput
                style={styles.fieldInput}
                value={name}
                onChangeText={(value) => { setName(value); setError(''); }}
                placeholder="e.g. Garden risotto"
                placeholderTextColor={colors.muted}
                accessibilityLabel="Dish name"
                autoCapitalize="words"
              />
            </FieldLabel>

            <FieldLabel title="Description">
              <TextInput
                style={[styles.fieldInput, styles.descriptionInput]}
                value={description}
                onChangeText={(value) => { setDescription(value); setError(''); }}
                placeholder="A short, appetizing description"
                placeholderTextColor={colors.muted}
                accessibilityLabel="Description"
                multiline
                textAlignVertical="top"
              />
            </FieldLabel>

            <FieldLabel title="Course">
              <View style={styles.courseOptions}>
                {courseTypes.map((option) => {
                  const isSelected = course === option;
                  return (
                    <Pressable
                      key={option}
                      style={[styles.courseOption, isSelected && styles.courseOptionSelected]}
                      onPress={() => setCourse(option)}
                      accessibilityRole="radio"
                      accessibilityState={{ checked: isSelected }}
                    >
                      <Text style={[styles.courseOptionText, isSelected && styles.courseOptionTextSelected]}>
                        {option}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </FieldLabel>

            <FieldLabel title="Price">
              <TextInput
                style={styles.fieldInput}
                value={price}
                onChangeText={(value) => { setPrice(value); setError(''); }}
                placeholder="0.00"
                placeholderTextColor={colors.muted}
                accessibilityLabel="Price"
                keyboardType="decimal-pad"
              />
            </FieldLabel>

            <Pressable style={styles.primaryButton} onPress={handleSubmit} accessibilityRole="button">
              <Text style={styles.primaryButtonText}>{item ? 'Save changes' : 'Add to menu'}</Text>
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function FieldLabel({ title, children }: { title: string; children: ReactElement }) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{title.toUpperCase()}</Text>
      {children}
    </View>
  );
}

const colors = {
  background: '#f5f3ee',
  paper: '#fffefa',
  ink: '#252a24',
  muted: '#72776f',
  line: '#deded4',
  sage: '#526c5c',
  sageDark: '#344b3e',
  orange: '#d46d3d',
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  listContent: { paddingHorizontal: 22, paddingBottom: 42 },
  topBar: { height: 70, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.line, gap: 11 },
  brandMark: { width: 34, height: 34, backgroundColor: colors.sageDark, alignItems: 'center', justifyContent: 'center' },
  brandMarkText: { color: colors.paper, fontWeight: '700', fontSize: 11, letterSpacing: 1 },
  brandName: { color: colors.ink, fontSize: 14, fontWeight: '700' },
  notice: { marginTop: 14, padding: 12, borderWidth: 1, borderColor: '#cbd8cd', backgroundColor: '#edf3ed', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  noticeText: { color: colors.sageDark, fontSize: 13, flex: 1 },
  dismissText: { color: colors.sageDark, fontSize: 22, paddingHorizontal: 5 },
  hero: { paddingTop: 45, paddingBottom: 30 },
  eyebrow: { color: colors.orange, fontSize: 10, fontWeight: '700', letterSpacing: 1.5, marginBottom: 11 },
  title: { color: colors.ink, fontSize: 43, lineHeight: 47, fontWeight: '700', letterSpacing: -1.5 },
  heroCopy: { maxWidth: 340, color: colors.muted, fontSize: 14, lineHeight: 21, marginTop: 13 },
  primaryButton: { minHeight: 48, backgroundColor: colors.sageDark, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18, marginTop: 20 },
  primaryButtonText: { color: '#ffffff', fontSize: 13, fontWeight: '700' },
  statsCard: { borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.line, backgroundColor: colors.paper },
  mainStat: { padding: 17, backgroundColor: colors.sageDark },
  statLabel: { color: colors.muted, fontSize: 9, fontWeight: '700', letterSpacing: 1.2 },
  mainStatValue: { color: colors.paper, fontSize: 38, fontWeight: '600', marginVertical: 2 },
  statNote: { color: colors.muted, fontSize: 11 },
  averageStat: { minHeight: 95, padding: 17, borderBottomWidth: 1, borderColor: colors.line, justifyContent: 'space-between' },
  averageStatValue: { color: colors.ink, fontSize: 26, fontWeight: '600', marginVertical: 4 },
  courseStats: { padding: 17 },
  courseStatRow: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', gap: 9, marginTop: 13 },
  courseStat: { color: colors.muted, fontSize: 11 },
  courseStatValue: { color: colors.ink, fontSize: 19, fontWeight: '700' },
  menuHeading: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 39, marginBottom: 8 },
  sectionTitle: { color: colors.ink, fontSize: 30, fontWeight: '700', letterSpacing: -0.7 },
  itemCount: { color: colors.orange, fontSize: 13, fontWeight: '700', paddingBottom: 4 },
  sectionDescription: { color: colors.muted, fontSize: 12, marginBottom: 17 },
  searchInput: { height: 46, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.paper, paddingHorizontal: 14, color: colors.ink, fontSize: 13 },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 11 },
  filterButton: { minHeight: 36, borderWidth: 1, borderColor: colors.line, paddingHorizontal: 12, alignItems: 'center', justifyContent: 'center' },
  filterButtonSelected: { backgroundColor: colors.ink, borderColor: colors.ink },
  filterText: { color: colors.muted, fontSize: 11 },
  filterTextSelected: { color: '#ffffff' },
  clearButton: { alignSelf: 'flex-start', paddingVertical: 10 },
  clearButtonText: { color: colors.muted, fontSize: 11, textDecorationLine: 'underline' },
  listLabel: { color: colors.muted, fontSize: 9, fontWeight: '700', letterSpacing: 1.3, marginTop: 14, marginBottom: 3 },
  menuCard: { flexDirection: 'row', gap: 14, paddingVertical: 20, borderTopWidth: 1, borderTopColor: colors.line },
  courseMarker: { width: 4, backgroundColor: colors.orange, borderRadius: 3 },
  mainMarker: { backgroundColor: colors.sage },
  dessertMarker: { backgroundColor: '#c4a159' },
  dishContent: { flex: 1 },
  dishTopline: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  courseName: { color: colors.orange, fontSize: 9, fontWeight: '700', letterSpacing: 1 },
  price: { color: colors.ink, fontSize: 13, fontWeight: '600' },
  dishName: { color: colors.ink, fontSize: 22, fontWeight: '600', marginTop: 7 },
  description: { color: colors.muted, fontSize: 12, lineHeight: 18, marginTop: 5 },
  actions: { flexDirection: 'row', gap: 8, marginTop: 13 },
  actionButton: { minHeight: 32, borderWidth: 1, borderColor: colors.line, paddingHorizontal: 13, justifyContent: 'center' },
  actionText: { color: colors.ink, fontSize: 11 },
  deleteButton: { minHeight: 32, paddingHorizontal: 10, justifyContent: 'center' },
  deleteText: { color: colors.orange, fontSize: 11 },
  emptyState: { alignItems: 'center', paddingHorizontal: 20, paddingVertical: 44, borderWidth: 1, borderStyle: 'dashed', borderColor: colors.line, backgroundColor: colors.paper },
  emptyIcon: { color: colors.orange, fontSize: 34, marginBottom: 9 },
  emptyTitle: { color: colors.ink, fontSize: 20, fontWeight: '600', textAlign: 'center' },
  emptyCopy: { color: colors.muted, fontSize: 12, lineHeight: 18, textAlign: 'center', marginTop: 8 },
  secondaryButton: { borderWidth: 1, borderColor: colors.ink, paddingHorizontal: 14, paddingVertical: 10, marginTop: 15 },
  secondaryButtonText: { color: colors.ink, fontSize: 11, fontWeight: '600' },
  modalBackdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(37,42,36,0.48)' },
  modalCard: { maxHeight: '92%', backgroundColor: colors.paper, borderTopLeftRadius: 18, borderTopRightRadius: 18, paddingHorizontal: 22, paddingTop: 25 },
  formContent: { paddingBottom: 30 },
  formHeading: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 19 },
  formTitle: { color: colors.ink, fontSize: 29, fontWeight: '700' },
  closeText: { color: colors.muted, fontSize: 29, lineHeight: 32, paddingHorizontal: 4 },
  formError: { color: '#a94327', backgroundColor: '#fbefea', borderLeftWidth: 3, borderLeftColor: colors.orange, padding: 10, fontSize: 12, marginBottom: 14 },
  fieldGroup: { marginBottom: 15 },
  fieldLabel: { color: colors.muted, fontSize: 9, fontWeight: '700', letterSpacing: 1, marginBottom: 7 },
  fieldInput: { minHeight: 46, borderWidth: 1, borderColor: colors.line, backgroundColor: '#ffffff', paddingHorizontal: 12, paddingVertical: 11, color: colors.ink, fontSize: 13 },
  descriptionInput: { minHeight: 88 },
  courseOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  courseOption: { minHeight: 39, borderWidth: 1, borderColor: colors.line, paddingHorizontal: 11, justifyContent: 'center' },
  courseOptionSelected: { backgroundColor: colors.sageDark, borderColor: colors.sageDark },
  courseOptionText: { color: colors.muted, fontSize: 11 },
  courseOptionTextSelected: { color: '#ffffff' },
});

export default App;

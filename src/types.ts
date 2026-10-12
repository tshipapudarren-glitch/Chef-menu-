export type CourseType = 'Starter' | 'Main Course' | 'Dessert';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  course: CourseType;
  price: number;
}

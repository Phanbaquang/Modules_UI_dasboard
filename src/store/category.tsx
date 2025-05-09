import { create } from 'zustand';

type Category = {
  _id: string;
  name: string;
  image: string;
  description: string;
  imageName: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
};

type CategoryState = {
  categories: Category[];
  totalProduct: number;
};

type CategoryActions = {
  setCategories: (categories: Category[]) => void;
  addCategory: (category: Category) => void;
  updateCategory: (updatedCategory: Category) => void;
  removeCategory: (_id: string) => void;
  settotalProduct: (totalProduct: number) => void;

};

export const useCategoryStore = create<CategoryState & CategoryActions>((set, get) => ({
  categories: [],
  totalProduct: 0,
  setCategories: (categories) => set({ categories }),

  addCategory: (category) => set((state) => ({
    categories: [category, ...state.categories],
  })),

  updateCategory: (updatedCategory) => set((state) => ({
    categories: state.categories.map((cat) =>
      cat._id === updatedCategory._id ? updatedCategory : cat
    ),
  })),

  removeCategory: (_id) => set((state) => ({
    categories: state.categories.filter((cat) => cat._id !== _id),
  })),
  settotalProduct: (totalProduct) => set({ totalProduct }),
}));

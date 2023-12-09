export interface FormValues {
  name: string;
  description: string;
  directions: string;
  tags: string[];
  ingredients: {
    ingredients: IngredientOption[];
  }[];
  servingSize: string;
  cookingTime: string | number | null;
  video: string;
  country: string;
  author: string;
  collections: CollectionOption[];
  publicationStatus: boolean;
}

export interface CollectionOption {
  value: string;
  label: string;
}

export interface IngredientOption {
  value: string;
  label: string;
  quantity: string;
  unit: string;
  error?: string;
}

export interface ImageFile {
  file: File;
  previewUrl: string;
}

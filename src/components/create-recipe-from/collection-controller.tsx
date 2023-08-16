import { type CollectionOption, type FormValues } from "./from-interface";
import { type ControllerRenderProps } from "react-hook-form";
import Select, { type ActionMeta } from "react-select";
import { api } from "~/utils/api";

interface CollectionControllerProps {
  field: ControllerRenderProps<FormValues, "collections">;
  currentValue: CollectionOption[];
}

const CollectionController: React.FC<CollectionControllerProps> = ({
  field,
  currentValue,
}) => {
  const { data: collections } = api.collection.getCollections.useQuery();
  const { onChange } = field;

  const collectionOptions: CollectionOption[] =
    collections?.map((collection: { id: string; name: string }) => ({
      value: collection.id,
      label: collection.name,
    })) ?? [];

  const handleInputChange = (
    newValue: CollectionOption[],
    actionMeta: ActionMeta<CollectionOption>
  ) => {
    if (actionMeta.action === "create-option") {
      const { label, value } = actionMeta.option;
      const existingOptionIndex = currentValue.findIndex(
        (option) => option.label === label
      );
      if (existingOptionIndex !== -1) {
        currentValue.splice(existingOptionIndex, 1);
      }
      const newCollection: CollectionOption = {
        value: value,
        label: label,
      };
      const updatedValue = [...currentValue, newCollection];
      onChange(updatedValue);
    } else {
      onChange(newValue);
    }
  };

  return (
    <Select
      {...field}
      isMulti
      classNamePrefix="select"
      isClearable={true}
      isSearchable={true}
      options={collectionOptions}
      onChange={handleInputChange}
    />
  );
};

export default CollectionController;

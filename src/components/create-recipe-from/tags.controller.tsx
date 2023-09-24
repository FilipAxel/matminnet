import { type ControllerRenderProps } from "react-hook-form";
import CreatableSelect from "react-select/creatable";
import { api } from "~/utils/api";
import { type TagOption, type FormValues } from "./from-interface";
import { type ChangeEvent, useState } from "react";
import { type ActionMeta, type MultiValue } from "react-select";
import { selectCustomStyle } from "../utils/form-utils";

interface TagsControllerProps {
  field: ControllerRenderProps<FormValues, "tags">;
  currentValue: TagOption[];
}
const TagsController: React.FC<TagsControllerProps> = ({
  field,
  currentValue,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const customSelectStyles = selectCustomStyle<TagOption>();
  const { data: tags } = api.tag.getAllTags.useQuery();
  const { onChange } = field;

  const handleCreate = (
    newValue: MultiValue<TagOption | TagOption[]>,
    actionMeta: ActionMeta<TagOption>
  ) => {
    setIsLoading(true);
    if (actionMeta.action === "create-option") {
      const { label, value } = actionMeta.option;
      const existingOptionIndex = currentValue.findIndex(
        (option) => option.label === label
      );
      if (existingOptionIndex !== -1) {
        currentValue.splice(existingOptionIndex, 1);
      }

      const newTag: TagOption = {
        value: value,
        label: label.charAt(0).toUpperCase() + label.slice(1),
      };

      const updatedValue = [...currentValue, newTag];
      onChange(updatedValue);
    } else {
      onChange(newValue as TagOption[] | ChangeEvent<Element>);
    }

    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const tagOptions: TagOption[] =
    tags?.map((tag: { name: string }) => ({
      value: tag.name,
      label: tag.name,
    })) ?? [];

  return (
    <>
      <CreatableSelect
        {...field}
        isMulti
        styles={customSelectStyles}
        isLoading={isLoading}
        aria-label={"tags"}
        options={tagOptions}
        isClearable={true}
        onChange={handleCreate}
      />
    </>
  );
};

export default TagsController;

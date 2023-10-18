import { type StylesConfig, type GroupBase } from "react-select";

export type CustomStyles<T> = StylesConfig<T, true, GroupBase<T>>;

export const selectCustomStyle = <T>(): CustomStyles<T> => ({
  control: (provided, _state) => ({
    ...provided,
    // custom styles
    minHeight: "70px",
    padding: "5px",
  }),
  menu: (provided, _state) => ({
    ...provided,
    // custom styles for the dropdown menu

    zIndex: 100,
  }),
});

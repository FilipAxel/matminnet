import { type StylesConfig, type GroupBase } from "react-select";

export type CustomStyles<T> = StylesConfig<T, true, GroupBase<T>>;

export const selectCustomStyle = <T>(): CustomStyles<T> => ({
  control: (provided, _state) => ({
    ...provided,
    // custom styles
    height: "70px",
  }),
});

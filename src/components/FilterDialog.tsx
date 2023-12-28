import {
  useDisclosure,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Avatar,
  Select,
  SelectItem,
  Chip,
  type Selection,
} from "@nextui-org/react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { MdFilterAlt } from "react-icons/md";
import { useDebouncedCallback } from "use-debounce";
import { type Filters, initialFilters } from "./RecipeSearch";
import { type Country, type Tag } from "@prisma/client";
import { type Key } from "react";

interface FilterDialogProps {
  selectedFilters: Filters;
  setSelectedFilters: React.Dispatch<React.SetStateAction<Filters>>;
  tags: Tag[] | undefined;
  countries: Country[] | undefined;
}

const cookingTime = [
  { name: "Under 15 minuter", value: "15" },
  { name: "Under 30 minuter", value: "30" },
  { name: "Under 60 minuter", value: "60" },
];

const FilterDialog: React.FC<FilterDialogProps> = ({
  selectedFilters,
  setSelectedFilters,
  tags,
  countries,
}) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleFilters = useDebouncedCallback(() => {
    const params = new URLSearchParams();
    const term = searchParams.get("query");
    if (term) {
      params.set("query", term);
    }

    if (selectedFilters.cookingTime) {
      params.set("cookingTime", selectedFilters.cookingTime);
    } else {
      params.delete("cookingTime");
    }

    if (selectedFilters.tags.length > 0) {
      params.set("tags", selectedFilters.tags.join(","));
    } else {
      params.delete("tags");
    }

    if (selectedFilters.countries.length > 0) {
      params.set("countries", selectedFilters.countries.join(","));
    } else {
      params.delete("countries");
    }

    void replace(`${pathname}?${params.toString()}`);
  }, 300);
  const handleAddTag = (newTag: string) => {
    setSelectedFilters((prevFilters) => {
      const isTagSelected = prevFilters.tags.includes(newTag);

      if (isTagSelected) {
        return {
          ...prevFilters,
          tags: prevFilters.tags.filter((tag) => tag !== newTag),
        };
      } else {
        return {
          ...prevFilters,
          tags: [...prevFilters.tags, newTag],
        };
      }
    });
  };

  const handleAddCookingTime = (newCookingTime: string) => {
    setSelectedFilters((prevFilters) => {
      const isCookingTimeSelected = prevFilters.cookingTime === newCookingTime;

      if (isCookingTimeSelected) {
        return {
          ...prevFilters,
          cookingTime: "",
        };
      } else {
        return {
          ...prevFilters,
          cookingTime: newCookingTime,
        };
      }
    });
  };

  const handelAddCountrys = (keys: Selection) => {
    setSelectedFilters((prevFilters) => {
      const isAllSelected = keys === "all";

      if (isAllSelected) {
        return {
          ...prevFilters,
          countries: [],
        };
      } else {
        const newCountry = keys as Set<Key>;
        const stringCountries = Array.from(newCountry).map(String);

        return {
          ...prevFilters,
          countries: stringCountries,
        };
      }
    });
  };

  return (
    <>
      <Button
        className="h-full w-[65px] bg-[#F3F3F4]"
        isIconOnly
        aria-label="filter"
        onPress={onOpen}
      >
        <MdFilterAlt className="text-3xl" />
      </Button>
      <Modal
        classNames={{
          body: "py-6",
          backdrop: "bg-[#f0f0f0]/50 backdrop-opacity-40",
          base: "border-[#f0f0f0] bg-[#ffffff] dark:bg-[#ffffff] text-[#333333]",
          header: "border-b-[1px] border-[#f0f0f0]",
          footer: "border-t-[1px] border-[#f0f0f0]",
          closeButton: "hover:bg-[#ffffff]/5 active:bg-[#ffffff]/10",
        }}
        placement="auto"
        scrollBehavior="inside"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Filter</ModalHeader>
              <ModalBody>
                <h1>Länder</h1>

                <Select
                  aria-label="Länder"
                  aria-labelledby="Länder"
                  items={countries}
                  selectedKeys={[...selectedFilters.countries]}
                  variant="bordered"
                  color="default"
                  isMultiline={true}
                  selectionMode="multiple"
                  onSelectionChange={handelAddCountrys}
                  listboxProps={{
                    itemClasses: {
                      base: [
                        "rounded-md",
                        "text-default-500",
                        "transition-opacity",
                      ],
                    },
                  }}
                  popoverProps={{
                    classNames: {
                      base: "before:bg-default-200",
                      content: "p-0 border-small border-divider bg-background",
                    },
                  }}
                  classNames={{
                    base: "border-[#a8b0d3]",
                    trigger: "min-h-unit-12 py-2 border-[#a8b0d3]",
                  }}
                  renderValue={(countries) => {
                    return (
                      <div className="my-2 flex flex-wrap gap-2">
                        {countries.map((country) => (
                          <Chip
                            variant="solid"
                            avatar={
                              <Avatar
                                alt={country.data?.name}
                                className="h-6 w-6"
                                src={`https://flagcdn.com/h20/${
                                  country.data?.countryCode || ""
                                }.png`}
                              />
                            }
                            key={country.key}
                          >
                            {country.data?.name}
                          </Chip>
                        ))}
                      </div>
                    );
                  }}
                >
                  {(country) => (
                    <SelectItem
                      key={country.name}
                      textValue={country.name}
                      startContent={
                        <Avatar
                          alt={country.name}
                          className="h-6 w-6"
                          src={`https://flagcdn.com/h20/${country.countryCode}.png`}
                        />
                      }
                    >
                      {country.name}
                    </SelectItem>
                  )}
                </Select>

                <h1>Tillagningstid</h1>
                <div className="flex flex-wrap gap-1">
                  {cookingTime.map((time) => {
                    return (
                      <div key={time.value}>
                        <Button
                          radius="full"
                          size="sm"
                          className={
                            selectedFilters?.cookingTime?.includes(time.value)
                              ? "text-white"
                              : "text-[#131416]"
                          }
                          color={
                            selectedFilters?.cookingTime?.includes(time.value)
                              ? "success"
                              : "default"
                          }
                          variant={
                            selectedFilters?.cookingTime?.includes(time.value)
                              ? "solid"
                              : "bordered"
                          }
                          onPress={() => handleAddCookingTime(time.value)}
                        >
                          {time.name}
                        </Button>
                      </div>
                    );
                  })}
                </div>
                {tags && (
                  <div className="flex flex-col gap-4">
                    <h1>Måltider</h1>
                    <div className="flex flex-wrap gap-1">
                      {tags.map(
                        (tag) =>
                          tag.type === "meal" && (
                            <div key={tag.id}>
                              <Button
                                radius="full"
                                className={
                                  selectedFilters.tags.includes(tag.name)
                                    ? "text-white"
                                    : "text-[#131416]"
                                }
                                size="sm"
                                color={
                                  selectedFilters.tags.includes(tag.name)
                                    ? "success"
                                    : "default"
                                }
                                variant={
                                  selectedFilters.tags.includes(tag.name)
                                    ? "solid"
                                    : "bordered"
                                }
                                onPress={() => handleAddTag(tag.name)}
                              >
                                {tag.name}
                              </Button>
                            </div>
                          )
                      )}
                    </div>
                    <h1>Kost</h1>
                    <div className="flex flex-wrap gap-1">
                      {tags.map(
                        (tag) =>
                          tag.type === "diet" && (
                            <div key={tag.id}>
                              <Button
                                radius="full"
                                className={
                                  selectedFilters.tags.includes(tag.name)
                                    ? "text-white"
                                    : "text-[#131416]"
                                }
                                size="sm"
                                color={
                                  selectedFilters.tags.includes(tag.name)
                                    ? "success"
                                    : "default"
                                }
                                variant={
                                  selectedFilters.tags.includes(tag.name)
                                    ? "solid"
                                    : "bordered"
                                }
                                onPress={() => handleAddTag(tag.name)}
                              >
                                {tag.name}
                              </Button>
                            </div>
                          )
                      )}
                    </div>
                    <h1>Andra</h1>
                    <div className="flex flex-wrap gap-1">
                      {tags.map(
                        (tag) =>
                          tag.type === "other" && (
                            <div key={tag.id}>
                              <Button
                                radius="full"
                                className={
                                  selectedFilters.tags.includes(tag.name)
                                    ? "text-white"
                                    : "text-[#131416]"
                                }
                                size="sm"
                                color={
                                  selectedFilters.tags.includes(tag.name)
                                    ? "success"
                                    : "default"
                                }
                                variant={
                                  selectedFilters.tags.includes(tag.name)
                                    ? "solid"
                                    : "bordered"
                                }
                                onPress={() => handleAddTag(tag.name)}
                              >
                                {tag.name}
                              </Button>
                            </div>
                          )
                      )}
                    </div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => {
                    onClose();
                    setSelectedFilters(initialFilters);
                    handleFilters();
                  }}
                >
                  Rensa allt
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    onClose();
                    handleFilters();
                  }}
                >
                  Tillämpa
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default FilterDialog;

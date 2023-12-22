import {
  useDisclosure,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { MdFilterAlt } from "react-icons/md";
import { useDebouncedCallback } from "use-debounce";
import { type Filters, initialFilters } from "./RecipeSearch";
import { type Tag } from "@prisma/client";

interface FilterDialogProps {
  selectedFilters: Filters;
  setSelectedFilters: React.Dispatch<React.SetStateAction<Filters>>;
  tags: Tag[] | undefined;
}

const FilterDialog: React.FC<FilterDialogProps> = ({
  selectedFilters,
  setSelectedFilters,
  tags,
}) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const cookingTime = [
    { name: "Under 15 minuter", value: "15" },
    { name: "Under 30 minuter", value: "30" },
    { name: "Under 60 minuter", value: "60" },
  ];

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
          backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
          base: "border-[#292f46] bg-[#19172c] dark:bg-[#19172c] text-[#a8b0d3]",
          header: "border-b-[1px] border-[#292f46]",
          footer: "border-t-[1px] border-[#292f46]",
          closeButton: "hover:bg-white/5 active:bg-white/10",
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
                              : "text-[#a8b0d3]"
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
                                    : "text-[#a8b0d3]"
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
                                    : "text-[#a8b0d3]"
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
                                    : "text-[#a8b0d3]"
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

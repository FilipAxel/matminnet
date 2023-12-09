import {
  useDisclosure,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import { useState } from "react";
import { type UseFormSetValue } from "react-hook-form";
import { api } from "~/utils/api";
import { type FormValues } from "../create-recipe-from/from-interface";
import { MdArrowForwardIos } from "react-icons/md";

interface TagComponentProps {
  setValue: UseFormSetValue<FormValues>;
  getValues: () => FormValues;
}

const TagSelector: React.FC<TagComponentProps> = ({ setValue, getValues }) => {
  const [selectedTags, setSelectedTags] = useState<string[]>(getValues().tags);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const { data: tags } = api.tag.getAllTags.useQuery();

  const onSelectTag = (name: string) => {
    setSelectedTags((prevSelectedTags) => {
      const isNameSelected = prevSelectedTags.includes(name);
      if (isNameSelected) {
        return prevSelectedTags.filter((tag) => tag !== name);
      } else {
        return [...prevSelectedTags, name];
      }
    });
  };

  const clearSelectedTags = () => {
    setSelectedTags([]);
  };

  const onSubmit = () => {
    setValue("tags", selectedTags);
    onClose();
  };

  return (
    <>
      <div
        onClick={onOpen}
        className="flex h-14 w-full cursor-pointer items-center justify-between border-1 p-2"
      >
        <h1>Add tags</h1>
        <MdArrowForwardIos />
      </div>
      <Modal
        className="w-full"
        placement="bottom"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Choose tags
              </ModalHeader>
              <ModalBody>
                {/* Group tags based on type */}
                {tags && (
                  <div className="flex flex-col gap-4">
                    <h1>Meals</h1>
                    <div className="flex flex-wrap gap-1">
                      {tags.map(
                        (tag) =>
                          tag.type === "meal" && (
                            <div key={tag.id}>
                              <Button
                                radius="full"
                                className={
                                  selectedTags.includes(tag.name)
                                    ? "text-white"
                                    : ""
                                }
                                size="sm"
                                color={
                                  selectedTags.includes(tag.name)
                                    ? "success"
                                    : "default"
                                }
                                variant={
                                  selectedTags.includes(tag.name)
                                    ? "solid"
                                    : "bordered"
                                }
                                onPress={() => onSelectTag(tag.name)}
                              >
                                {tag.name}
                              </Button>
                            </div>
                          )
                      )}
                    </div>
                    <h1>Diet</h1>
                    <div className="flex flex-wrap gap-1">
                      {tags.map(
                        (tag) =>
                          tag.type === "diet" && (
                            <div key={tag.id}>
                              <Button
                                radius="full"
                                className={
                                  selectedTags.includes(tag.name)
                                    ? "text-white"
                                    : ""
                                }
                                size="sm"
                                color={
                                  selectedTags.includes(tag.name)
                                    ? "success"
                                    : "default"
                                }
                                variant={
                                  selectedTags.includes(tag.name)
                                    ? "solid"
                                    : "bordered"
                                }
                                onPress={() => onSelectTag(tag.name)}
                              >
                                {tag.name}
                              </Button>
                            </div>
                          )
                      )}
                    </div>
                    <h1>Others</h1>
                    <div className="flex flex-wrap gap-1">
                      {tags.map(
                        (tag) =>
                          tag.type === "other" && (
                            <div key={tag.id}>
                              <Button
                                radius="full"
                                className={
                                  selectedTags.includes(tag.name)
                                    ? "text-white"
                                    : ""
                                }
                                size="sm"
                                color={
                                  selectedTags.includes(tag.name)
                                    ? "success"
                                    : "default"
                                }
                                variant={
                                  selectedTags.includes(tag.name)
                                    ? "solid"
                                    : "bordered"
                                }
                                onPress={() => onSelectTag(tag.name)}
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
                  onPress={clearSelectedTags}
                  color="danger"
                  variant="light"
                >
                  Clear All
                </Button>
                <Button color="primary" onPress={onSubmit}>
                  Add
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default TagSelector;

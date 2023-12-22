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
        <h1>Lägg till taggar</h1>
        <MdArrowForwardIos />
      </div>
      <Modal
        className="w-full"
        classNames={{
          body: "py-6",
          backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
          base: "border-[#292f46] bg-[#19172c] dark:bg-[#19172c] text-[#a8b0d3]",
          header: "border-b-[1px] border-[#292f46]",
          footer: "border-t-[1px] border-[#292f46]",
          closeButton: "hover:bg-white/5 active:bg-white/10",
        }}
        placement="auto"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Välj taggar
              </ModalHeader>
              <ModalBody>
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
                                  selectedTags.includes(tag.name)
                                    ? "text-white"
                                    : "text-[#a8b0d3]"
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
                    <h1>Kost</h1>
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
                                    : "text-[#a8b0d3]"
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
                    <h1>Andra</h1>
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
                                    : "text-[#a8b0d3]"
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
                  Rensa allt
                </Button>
                <Button color="primary" onPress={onSubmit}>
                  Lägg till
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

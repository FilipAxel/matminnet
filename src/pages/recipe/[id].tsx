import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Chip,
  Divider,
  Image,
} from "@nextui-org/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { MdOutlineTimer } from "react-icons/md";
import TimerDialog from "~/components/dialog/timer-dialog";
import BackButton from "~/components/shared/back-button";
import SkeletonRecipe from "~/components/skeleton/recipe-skeleton";
import { api } from "~/utils/api";

const Recipe = () => {
  const router = useRouter();
  const { query } = router;
  const id = query.id as string;
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [openTimerStep, setOpenTimerStep] = useState<string>("");

  const { data: recipe, isLoading } = api.recipe.getRecipeWithId.useQuery({
    id,
  });

  if (!recipe && !isLoading) {
    void router.push("/404");
  }
  if (isLoading) {
    return <SkeletonRecipe />;
  }

  if (!isLoading) {
    return (
      <>
        <div className="mb-10 max-w-5xl">
          <BackButton />

          <div className="flex w-full justify-center">
            <Image
              className="h-[380px] max-h-[400px] w-[300px] max-w-[400px] justify-center rounded-[15px] object-cover md:h-full md:w-full"
              src={
                recipe?.images?.[mainImageIndex]?.name ??
                "/recipe-placeholder.webp"
              }
              width={0}
              height={0}
              alt={
                recipe?.images?.[mainImageIndex]?.name ?? "placeholder image"
              }
            />
          </div>

          {recipe?.images?.length && recipe.images.length >= 1 && (
            <div className="flex justify-center gap-2">
              {recipe?.images?.map((image, index) => (
                <div
                  key={index}
                  className={`mt-5 cursor-pointer  rounded-[10px] ${
                    index === mainImageIndex ? "border-2 border-[#b195d2]" : ""
                  }`}
                >
                  <Image
                    src={image.name}
                    className="m-1 h-[100px] w-[100px]"
                    onClick={() => setMainImageIndex(index)}
                    alt={`Image ${index}`}
                  />
                </div>
              ))}
            </div>
          )}

          <h1 className="mt-5 text-center text-[30px] font-bold">
            {recipe?.name}
          </h1>

          <div className="mx-3 my-4 flex justify-center gap-2">
            {recipe?.tags.map((tag, index) => (
              <Chip
                className="cursor-pointer bg-[#b195d2] p-2 font-semibold text-white"
                key={index}
                size="md"
              >
                {tag.tag.name}
              </Chip>
            ))}
          </div>

          <div className="mt-5 flex flex-row items-center justify-between">
            <h2 className="ml-4 text-[25px]">Ingredients</h2>

            {recipe?.servingSize && (
              <h3 className="mr-4 text-[20px]">
                Serving size: {recipe?.servingSize}
              </h3>
            )}
          </div>

          <div className="ml-4 mt-5 flex flex-col gap-2 sm:ml-10">
            {recipe?.ingredientsSection.map((ingredientStep) => {
              return (
                <div className="grid" key={ingredientStep.id}>
                  <Card className="w-full max-w-[400px] p-4">
                    <h2 className="font-semibold">{ingredientStep.name}</h2>
                    <CardBody className="flex flex-col items-start">
                      {ingredientStep.ingredients.map((ingredient) => (
                        <div
                          className="flex w-full flex-row items-center justify-between"
                          key={ingredient.id}
                        >
                          <h2 className="font-normal text-gray-800">
                            {ingredient.ingredient.name}
                          </h2>
                          <h3 className="text-[15px] font-semibold text-gray-800">
                            {ingredient.quantity} {ingredient.unit}
                          </h3>
                        </div>
                      ))}
                    </CardBody>
                  </Card>
                </div>
              );
            })}
          </div>

          <div className="flex w-full flex-col items-center justify-center gap-3 px-2 pb-5">
            <h2 className="mb-2 mt-5 text-[25px] font-bold">Directions</h2>
            {recipe?.directions &&
              recipe?.directions.map((direction) => {
                return (
                  <Card
                    radius="sm"
                    fullWidth
                    key={direction.mainStepIndex}
                    className="max-w-[700px] p-2"
                  >
                    <CardHeader className="flex flex-col items-start gap-3">
                      <Checkbox
                        lineThrough
                        color="primary"
                        radius="none"
                        size="lg"
                        classNames={{
                          base: "data-[selected=true]:truncate",
                          label: "data-[selected=true]:truncate",
                        }}
                      >
                        <p className="ml-1 text-left font-normal">
                          {direction.mainStepValue}
                        </p>
                      </Checkbox>
                    </CardHeader>

                    {direction.time?.timeValue && (
                      <>
                        <Button
                          className="mx-2 my-4 bg-[#cf2d051e] text-base font-semibold text-[#cf2e05]"
                          radius="full"
                          onPress={() =>
                            setOpenTimerStep(direction.mainStepValue)
                          }
                        >
                          <MdOutlineTimer /> Open Timer:&nbsp;
                          {direction.time?.timeValue}&nbsp;
                          {direction.time?.unit}
                        </Button>
                        {openTimerStep === direction.mainStepValue && (
                          <TimerDialog
                            direction={direction.mainStepValue}
                            timeValue={direction.time?.timeValue}
                            unit={direction.time?.unit}
                            isOpen={openTimerStep === direction.mainStepValue}
                            onClose={() => setOpenTimerStep("")}
                          />
                        )}
                      </>
                    )}

                    {direction.subSteps.length > 0 && (
                      <>
                        <Divider />
                        <CardBody>
                          {direction.subSteps.map((step) => {
                            return (
                              <div className="p-[6px]" key={step.subStepIndex}>
                                <Checkbox
                                  lineThrough
                                  color="primary"
                                  classNames={{
                                    base: "data-[selected=true]:truncate",
                                    label: "data-[selected=true]:truncate",
                                  }}
                                  radius="none"
                                  size="lg"
                                >
                                  <p className="ml-2 text-left font-normal">
                                    {step.subStepValue}
                                  </p>
                                </Checkbox>
                                {step.time?.timeValue && (
                                  <>
                                    <Button
                                      className="my-4 bg-[#cf2d051e] text-sm font-semibold text-[#cf2e05]"
                                      radius="full"
                                      onPress={() => {
                                        setOpenTimerStep(step.subStepValue);
                                      }}
                                    >
                                      <MdOutlineTimer /> Open Timer:&nbsp;
                                      {step.time?.timeValue}&nbsp;
                                      {step.time?.unit}
                                    </Button>
                                    <Divider className="mb-2" />
                                    {openTimerStep === step.subStepValue && (
                                      <TimerDialog
                                        direction={step.subStepValue}
                                        timeValue={step.time?.timeValue}
                                        unit={step.time?.unit}
                                        isOpen={
                                          openTimerStep === step.subStepValue
                                        }
                                        onClose={() => setOpenTimerStep("")}
                                      />
                                    )}
                                  </>
                                )}
                              </div>
                            );
                          })}
                        </CardBody>
                      </>
                    )}
                  </Card>
                );
              })}
          </div>

          {recipe?.video && (
            <div className="aspect-h-9 aspect-w-16 m-5 flex justify-center">
              <iframe
                src={recipe?.video || ""}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          )}
        </div>
      </>
    );
  }
};

export default Recipe;

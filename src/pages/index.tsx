import { Button, Image, Link } from "@nextui-org/react";
import ActionCard from "~/components/shared/action-card";
import NextImage from "next/image";

export default function Home() {
  return (
    <>
      <div className="pt-20">
        <div className="container mx-auto flex flex-col flex-wrap items-center px-3 md:flex-row md:px-0">
          <div className="flex w-full flex-col items-start justify-center text-center md:w-2/5 md:text-left">
            <p className="tracking-loose w-full font-sans text-[12px] uppercase">
              Discover Delicious Recipes and Share Your Culinary Creations
            </p>
            <h1 className="my-6 font-sans text-4xl font-bold leading-tight">
              Have a recipe you want to share? Save all your recipes in one
              place!
            </h1>
            <p className="text-1xl mx-1 mb-8 font-sans leading-normal">
              Tired of cluttered kitchen shelves filled with cookbooks? Join our
              community and make your life easier.
            </p>

            <div className="flex w-full justify-center space-x-4 font-sans lg:justify-start">
              <Button
                href="/discover"
                as={Link}
                size="md"
                color="primary"
                variant="solid"
              >
                Explore Recipes
              </Button>
              <Button
                href="/recipes/create"
                as={Link}
                size="md"
                color="primary"
                variant="solid"
              >
                Share Your Recipes
              </Button>
            </div>
          </div>

          <Image
            as={NextImage}
            width={0}
            height={0}
            alt="hero"
            className="z-0 mx-auto h-[520px] w-[520px] md:ml-7"
            src="/hero.svg"
          />
        </div>
      </div>
      <section className=" bg-white py-8">
        <div className="container m-8 mx-auto max-w-5xl">
          <div className="mb-4 w-full">
            <div className="gradient mx-auto my-0 h-1 w-64 rounded-t py-0 opacity-25"></div>
          </div>
          <div className="flex flex-wrap items-center justify-center sm:justify-start">
            <div className="w-5/6 p-6 text-center sm:w-1/2 sm:text-left">
              <h3 className="mb-3 text-3xl font-bold leading-none text-gray-800">
                Need Dinner Inspiration?
              </h3>
              <p className="mb-8 font-mono text-gray-600">
                Are you wondering what to cook for dinner tonight? Look no
                further! Our recipe collection is here to rescue you from the
                &quot;What&apos;s for dinner?&quot; dilemma.
                <br />
                <br />
                <Link color="primary" className="underline" href="/discover">
                  Find inspiration here
                </Link>
              </p>
            </div>
            <div className="w-full p-6 sm:w-1/2">
              <Image
                alt="hero"
                className="z-0 w-full md:w-3/5"
                src="hero.png"
              />
            </div>
          </div>
          <div className="flex flex-col-reverse flex-wrap items-center  justify-center sm:flex-row sm:justify-start">
            <div className="mt-6 w-full p-6 sm:w-1/2">
              <Image
                alt="hero"
                className="z-0 w-full md:w-3/5"
                src="hero.png"
              />
            </div>
            <div className="mt-6 w-full p-6 sm:w-1/2">
              <div className="text-center align-middle sm:text-left">
                <h3 className="mb-3 text-3xl font-bold leading-none text-gray-800">
                  Simplify Your Cookbook Collection
                </h3>
                <p className="mb-8 font-mono text-gray-600">
                  Tired of cluttered kitchen shelves filled with cookbooks? Join
                  our community and make your life easier. By adding your
                  favorite recipes to our website, you&apos;ll be part of a
                  cooking revolution.
                  <br />
                  <br />
                  <br />
                  <br />
                  <Link
                    color="primary"
                    className="underline"
                    href="/recipes/create"
                  >
                    Start Sharing Your Recipes
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="px-4 py-8">
        <div className="container mx-auto flex flex-wrap gap-5 pb-12 pt-4">
          <h2 className="mx-4 my-2 w-full text-center text-4xl font-bold leading-tight text-gray-800 lg:text-5xl">
            Explore Our Recipe Features
          </h2>
          <div className="mb-4 w-full">
            <div className="gradient mx-auto my-0 h-1 w-64 rounded-t py-0 opacity-25"></div>
          </div>
          <ActionCard
            subTitle="Build Your Own Recipes"
            message="With our user-friendly recipe builder, you can create and customize your own delicious recipes, complete with ingredients and cooking instructions. Let your culinary creativity shine!"
            buttonText="Get Started"
            link="/recipes/create"
          />

          <ActionCard
            subTitle="Share Your Culinary Creations"
            message="Share your culinary masterpieces with the world! Publish your recipes, and they will be accessible to everyone, making it easy for others to discover and enjoy your dishes. Start sharing your love for cooking today!"
            buttonText="Publish Now"
            link="/recipes/create"
          />

          <ActionCard
            subTitle="Find the Right Recipe"
            message="Looking for the perfect dish? Explore our extensive collection of recipes and find the one that suits your taste. Your culinary journey begins here!"
            buttonText="Search Now"
            link="/recipes"
          />
        </div>
      </section>
      <section className="container mx-auto mb-12 py-6 text-center">
        <div className="mx-auto mt-6 flex w-full justify-center p-6">
          <Image alt="hero" className="z-0 mx-auto w-full" src="hero.png" />
        </div>
        <h2 className="my-2 w-full text-center text-4xl font-bold leading-tight">
          Share Your Culinary Creations
        </h2>
        <div className="mb-4 w-full">
          <div className="mx-auto my-0 h-1 w-1/6 rounded-t bg-white py-0 opacity-25"></div>
        </div>
        <h3 className="my-4 ml-6 mr-2 text-left text-xl text-gray-600">
          Why add your recipes here? With our platform, you can organize your
          recipes effortlessly, find new culinary inspirations shared by fellow
          users, and access your recipes from anywhere. Say goodbye to the chaos
          of traditional cookbooks, and embrace the convenience of a digital
          recipe hub.
        </h3>

        <Button
          href="/recipes/create"
          as={Link}
          size="lg"
          color="primary"
          className="mt-5"
          radius="full"
        >
          Create Recipe
        </Button>
      </section>
    </>
  );
}

import {
  type InferGetServerSidePropsType,
  type GetServerSidePropsContext,
} from "next";
import { getServerSession } from "next-auth";
import { getProviders, signIn } from "next-auth/react";
import Image from "next/image";
import { authOptions } from "~/server/auth";
import { FcGoogle } from "react-icons/fc";

const SignIn = ({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const handleSignIn = async (providerId: string) => {
    try {
      await signIn(providerId, {
        callbackUrl: `${window.location.origin}`,
      });
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  return (
    <>
      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <div className="lg:px-8 flex min-h-full flex-1 flex-col justify-center px-6 py-12">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <Image
                width={100}
                height={100}
                className="mx-auto h-60 w-auto rounded-full bg-black"
                src="/icon-512x512.png"
                alt="Mat Minne"
              />
              <h1 className="mt-10 text-center text-2xl font-semibold leading-9 tracking-tight text-gray-900">
                Sign in to your account
              </h1>
            </div>

            <div className="mx-auto mt-6 flex w-[300px] items-center justify-center">
              <button
                onClick={() => void handleSignIn(provider.id)}
                type="submit"
                className="flex w-full items-center justify-center rounded-md bg-indigo-600 px-3 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 focus:outline-none focus:ring focus:ring-indigo-300 focus:ring-opacity-50"
              >
                <span className="mr-4">
                  <FcGoogle className="text-2xl" />
                </span>
                <h1 className="font-bold text-white">Continue with Google</h1>
              </button>
            </div>
            <div className="mt-5 flex items-center justify-center text-center">
              <h3 className="text-gray-600">Don&apos;t have an account?</h3>
              <h3
                onClick={() => void handleSignIn(provider.id)}
                className="ml-1 font-semibold"
              >
                Sign up
              </h3>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default SignIn;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  if (session) {
    return { redirect: { destination: "/" } };
  }

  const providers = await getProviders();

  return {
    props: { providers: providers ?? [] },
  };
}

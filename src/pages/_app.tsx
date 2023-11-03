import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "~/utils/api";
import { Analytics } from "@vercel/analytics/react";
import "~/styles/globals.css";
import { NextUIProvider, Spacer } from "@nextui-org/react";
import NavigationBar from "~/components/navigation/navigation-bar";
import { Inter, Roboto_Mono } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const roboto_mono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
  display: "swap",
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <NextUIProvider>
        <NavigationBar />
        <Spacer y={1} />
        <div
          className={`${inter.variable} ${roboto_mono.variable} m-auto max-w-[1200px] font-sans`}
        >
          <Component {...pageProps} />
        </div>

        <Analytics />
      </NextUIProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);

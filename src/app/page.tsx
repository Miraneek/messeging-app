import { api, HydrateClient } from "@/trpc/server";
import Main from "@/app/_components/Main";

export default async function Page() {
  const initialMessages = await api.messages.getMessages();

  return (
    <HydrateClient>
      <Main initialMessages={initialMessages} />
    </HydrateClient>
  );
}

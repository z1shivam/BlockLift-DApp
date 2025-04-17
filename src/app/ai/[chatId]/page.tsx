import AiChatbot from "@/components/client/AiChatbot";

export default async function Page({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) {
  const { chatId } = await params;
  return <AiChatbot chatId={chatId} />;
}

import {
  listMessagesAdmin,
  messageCounts,
  type MessageStatus,
} from "@/app/admin/mensajes/actions";
import FiltersBar from "./FiltersBar";
import MessageCard from "./MessageCard";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; interest?: string; q?: string }>;
}) {
  const params = await searchParams;
  const status = (params.status as MessageStatus | "todos") || "todos";
  const interest = params.interest || "todos";
  const search = params.q || "";

  const [messages, counts] = await Promise.all([
    listMessagesAdmin({ status, interest, search }),
    messageCounts(),
  ]);

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h1
          className="font-victor text-sm tracking-[0.35em] uppercase"
          style={{ color: "var(--gold)" }}
        >
          mensajes
        </h1>
        <p className="font-victor text-[10px]" style={{ color: "rgba(176,170,152,0.4)" }}>
          {counts.todos} consulta{counts.todos === 1 ? "" : "s"} en total
        </p>
      </div>

      <FiltersBar counts={counts} />

      <div className="space-y-3">
        {messages?.length === 0 && (
          <p
            className="font-victor text-xs py-12 text-center"
            style={{ color: "rgba(176,170,152,0.4)" }}
          >
            no hay consultas que coincidan con estos filtros.
          </p>
        )}

        {messages?.map((msg) => (
          <MessageCard key={msg.id} msg={msg} />
        ))}
      </div>
    </>
  );
}

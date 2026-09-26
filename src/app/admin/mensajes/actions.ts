"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type MessageStatus = "nuevo" | "leido" | "respondido" | "archivado";

export interface ContactMessageInput {
  name: string;
  email: string;
  phone?: string;
  interest?: string;
  message: string;
}

export interface MessageFilters {
  status?: MessageStatus | "todos";
  interest?: string | "todos";
  search?: string;
}

/**
 * Llamada pública desde el formulario de contacto del sitio (sin auth).
 * Inserta una nueva consulta. Permitido por la policy RLS "contact_messages_public_insert".
 */
export async function submitContactMessage(input: ContactMessageInput) {
  const name = input.name?.trim();
  const email = input.email?.trim();
  const message = input.message?.trim();

  if (!name || !email) {
    throw new Error("Nombre y email son obligatorios.");
  }

  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").insert({
    name,
    email,
    phone: input.phone?.trim() || null,
    interest: input.interest || null,
    message: message || null,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/admin/mensajes");
  return { ok: true };
}

/**
 * Listado para el panel admin, con filtros por estado, categoría y búsqueda de texto.
 */
export async function listMessagesAdmin(filters: MessageFilters = {}) {
  const supabase = await createClient();
  let query = supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (filters.status && filters.status !== "todos") {
    query = query.eq("status", filters.status);
  }

  if (filters.interest && filters.interest !== "todos") {
    if (filters.interest === "other") {
      query = query.or("interest.is.null,interest.eq.other");
    } else {
      query = query.eq("interest", filters.interest);
    }
  }

  if (filters.search && filters.search.trim()) {
    const term = filters.search.trim().replace(/[%_]/g, "");
    query = query.or(
      `name.ilike.%${term}%,email.ilike.%${term}%,message.ilike.%${term}%,phone.ilike.%${term}%`
    );
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
}

export async function unreadMessagesCount() {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("contact_messages")
    .select("*", { count: "exact", head: true })
    .eq("status", "nuevo");

  if (error) throw new Error(error.message);
  return count ?? 0;
}

export async function messageCounts() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contact_messages")
    .select("status");

  if (error) throw new Error(error.message);

  const counts: Record<string, number> = {
    todos: data?.length ?? 0,
    nuevo: 0,
    leido: 0,
    respondido: 0,
    archivado: 0,
  };
  data?.forEach((row) => {
    counts[row.status] = (counts[row.status] ?? 0) + 1;
  });
  return counts;
}

export async function updateMessageStatus(id: string, status: MessageStatus) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("contact_messages")
    .update({ status })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/mensajes");
}

export async function updateMessageNotes(id: string, notes: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("contact_messages")
    .update({ admin_notes: notes })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/mensajes");
}

export async function deleteMessage(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/mensajes");
}

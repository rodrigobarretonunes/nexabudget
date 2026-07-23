import { supabase } from "../lib/supabase";
import type { Transaction } from "../types";


function mapTransaction(row: any): Transaction {
  return {
    id: row.id,
    label: row.label,
    amount: Number(row.amount),
    date: row.date,
    category: row.category ?? "",
    visibility: row.visibility,
    ownerId: row.user_id,
    type: row.type,
  };
}


export async function getTransactions(): Promise<Transaction[]> {

  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .order("date", { ascending: false });


  if (error) {
    console.error(error);
    throw error;
  }


  return data.map(mapTransaction);
}



export async function createTransaction(
  transaction: Omit<Transaction, "id" | "ownerId">
) {


  const {
    data: { user },
  } = await supabase.auth.getUser();


  if (!user) {
    throw new Error("Usuário não autenticado");
  }


  const { data, error } = await supabase
    .from("transactions")
    .insert({
      user_id: user.id,
      label: transaction.label,
      amount: transaction.amount,
      date: transaction.date,
      category: transaction.category,
      visibility: transaction.visibility,
      type: transaction.type,
    })
    .select()
    .single();


  if (error) {
    console.error(error);
    throw error;
  }


  return mapTransaction(data);
}



export async function deleteTransaction(id: string) {

  const { error } = await supabase
    .from("transactions")
    .delete()
    .eq("id", id);


  if (error) {
    console.error(error);
    throw error;
  }
}
import { supabase } from "../lib/supabase";
import type { DeferredDebit } from "../types";


export async function getDeferredDebits(){

 const {data,error}=await supabase
 .from("deferred_debits")
 .select("*")
 .order("debit_date");


 if(error) throw error;


 return data as DeferredDebit[];

}



export async function createDeferredDebit(
 debit:Omit<DeferredDebit,"id">
){

 const {
  data:{user}
 }=await supabase.auth.getUser();


 if(!user)
  throw new Error("Usuário não autenticado");


 const {data,error}=await supabase
 .from("deferred_debits")
 .insert({
   ...debit,
   user_id:user.id
 })
 .select()
 .single();


 if(error) throw error;


 return data;

}



export async function deleteDeferredDebit(id:string){

 const {error}=await supabase
 .from("deferred_debits")
 .delete()
 .eq("id",id);


 if(error) throw error;

}
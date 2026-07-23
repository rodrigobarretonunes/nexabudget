import { supabase } from "../lib/supabase";
import type { PlanningEvent } from "../types";


export async function getPlanningEvents(){

 const {data,error}=await supabase
 .from("planning_events")
 .select("*")
 .order("date");


 if(error) throw error;


 return data as PlanningEvent[];

}




export async function createPlanningEvent(
 event:Omit<PlanningEvent,"id">
){

 const {
 data:{user}
 }=await supabase.auth.getUser();


 if(!user)
 throw new Error("Usuário não autenticado");



 const {data,error}=await supabase
 .from("planning_events")
 .insert({
   ...event,
   user_id:user.id
 })
 .select()
 .single();



 if(error) throw error;


 return data;

}




export async function deletePlanningEvent(id:string){

 const {error}=await supabase
 .from("planning_events")
 .delete()
 .eq("id",id);



 if(error) throw error;

}
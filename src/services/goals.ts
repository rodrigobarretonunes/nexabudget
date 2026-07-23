import { supabase } from "../lib/supabase";
import type { Goal } from "../types";


export async function getGoals(){

 const {data,error}=await supabase
 .from("goals")
 .select("*")
 .order("created_at",{ascending:false});


 if(error) throw error;


 return data as Goal[];

}



export async function createGoal(
 goal:Omit<Goal,"id">
){

 const {
 data:{user}
 }=await supabase.auth.getUser();


 if(!user)
 throw new Error("Usuário não autenticado");


 const {data,error}=await supabase
 .from("goals")
 .insert({
   ...goal,
   user_id:user.id
 })
 .select()
 .single();


 if(error) throw error;


 return data;

}




export async function updateGoal(
 id:string,
 current:number
){

 const {data,error}=await supabase
 .from("goals")
 .update({
   current
 })
 .eq("id",id)
 .select()
 .single();


 if(error) throw error;


 return data;

}



export async function deleteGoal(id:string){

 const {error}=await supabase
 .from("goals")
 .delete()
 .eq("id",id);


 if(error) throw error;

}
import { useEffect, useState } from 'react';

import type {
  Transaction,
  DeferredDebit,
  Goal,
  PlanningEvent,
} from '../types';


import {
  getTransactions,
  createTransaction,
  deleteTransaction,
} from '../services/transactions';


import {
  getGoals,
  createGoal,
  updateGoal as updateGoalService,
  deleteGoal,
} from '../services/goals';


import {
  getPlanningEvents,
  createPlanningEvent,
  deletePlanningEvent,
} from '../services/planningEvents';


import {
  getDeferredDebits,
  createDeferredDebit,
  deleteDeferredDebit,
} from '../services/deferredDebits';



export function useBudgetStore() {


  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [deferredDebits, setDeferredDebits] = useState<DeferredDebit[]>([]);

  const [goals, setGoals] = useState<Goal[]>([]);

  const [planning, setPlanning] = useState<PlanningEvent[]>([]);


  const [loading, setLoading] = useState(true);




  useEffect(() => {


    async function load(){


      try{


        const [
          transactionsData,
          debitsData,
          goalsData,
          planningData

        ] = await Promise.all([

          getTransactions(),

          getDeferredDebits(),

          getGoals(),

          getPlanningEvents()

        ]);



        setTransactions(transactionsData);

        setDeferredDebits(debitsData);

        setGoals(goalsData);

        setPlanning(planningData);



      }catch(error){

        console.error(
          "Erro carregando dados:",
          error
        );


      }finally{

        setLoading(false);

      }

    }



    load();



  }, []);






  // ==========================
  // TRANSACTIONS
  // ==========================


  async function addTransaction(
    t:Omit<Transaction,'id'|'ownerId'>
  ){


    const created = await createTransaction(t);


    setTransactions(prev=>[
      created,
      ...prev
    ]);

  }




  async function removeTransaction(
    id:string
  ){


    await deleteTransaction(id);


    setTransactions(prev=>
      prev.filter(t=>t.id!==id)
    );

  }







  // ==========================
  // DEFERRED DEBITS
  // ==========================


  async function addDebit(
    d:Omit<DeferredDebit,'id'>
  ){


    const created = await createDeferredDebit(d);



    setDeferredDebits(prev=>[

      created,

      ...prev

    ]);

  }





  async function removeDebit(
    id:string
  ){


    await deleteDeferredDebit(id);



    setDeferredDebits(prev=>

      prev.filter(d=>d.id!==id)

    );


  }







  // ==========================
  // GOALS
  // ==========================



  async function addGoal(
    g:Omit<Goal,'id'>
  ){


    const created = await createGoal(g);



    setGoals(prev=>[

      created,

      ...prev

    ]);

  }






  async function updateGoal(
    id:string,
    current:number
  ){


    const updated = await updateGoalService(
      id,
      current
    );



    setGoals(prev=>

      prev.map(g=>

        g.id===id

        ? updated

        : g

      )

    );

  }






  async function removeGoal(
    id:string
  ){


    await deleteGoal(id);



    setGoals(prev=>

      prev.filter(g=>g.id!==id)

    );

  }








  // ==========================
  // PLANNING
  // ==========================


  async function addPlanningEvent(
    p:Omit<PlanningEvent,'id'>
  ){


    const created = await createPlanningEvent(p);



    setPlanning(prev=>

      [

        ...prev,

        created

      ]

      .sort(

        (a,b)=>

        a.date.localeCompare(b.date)

      )

    );

  }





  async function removePlanningEvent(
    id:string
  ){


    await deletePlanningEvent(id);



    setPlanning(prev=>

      prev.filter(p=>p.id!==id)

    );


  }






  return {


    transactions,

    addTransaction,

    removeTransaction,



    deferredDebits,

    addDebit,

    removeDebit,



    goals,

    addGoal,

    updateGoal,

    removeGoal,



    planning,

    addPlanningEvent,

    removePlanningEvent,



    loading,


  };


}
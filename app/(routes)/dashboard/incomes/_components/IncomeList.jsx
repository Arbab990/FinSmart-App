"use client";
import React, { useEffect, useState } from "react";
import CreateIncomes from "./CreateIncomes";
import { db } from "@/utils/dbConfig";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { Incomes, Expenses } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import IncomeItem from "./IncomeItem";

function IncomeList() {
  const [incomelist, setIncomelist] = useState([]);
  const { user } = useUser();
  useEffect(() => {
    user && getIncomelist();
  }, [user]);
  

  const getIncomelist = async () => {
    const userEmail = user?.primaryEmailAddress?.emailAddress;
    
    
    
    const result = await db
      .select({
        ...getTableColumns(Incomes),
        amount: sql`sum(CAST(${Incomes.amount} AS numeric))`.mapWith(Number),
        
        totalSpend: sql`sum(CAST(${Expenses.amount} AS numeric))`.mapWith(Number),
        totalItem: sql`count(${Expenses.id})`.mapWith(Number),
      })
      .from(Incomes)
      .leftJoin(Expenses, eq(Incomes.id, Expenses.budgetId))
      .where(eq(Incomes.createdBy, userEmail))
      .groupBy(Incomes.id)
      .orderBy(desc(Incomes.id));
    console.log("result",result)
    let Totalincome=0
    result.forEach((item, index) => {
      console.log(`Income Entry ${index + 1}: Amount = ${item.amount}`);
      Totalincome += item.amount; 
    console.log("totalIncome",Totalincome)
    });
    
    

    setIncomelist(result);
    
  };
  

  return (
    <div className="mt-7">
      <div
        className="grid grid-cols-1
        md:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        <CreateIncomes refreshData={() => getIncomelist()} />
        {incomelist?.length > 0
          ? incomelist.map((budget, index) => (
              <IncomeItem budget={budget} key={index} />
            ))
          : [1, 2, 3, 4, 5].map((item, index) => (
              <div
                key={index}
                className="w-full bg-slate-200 rounded-lg
        h-[150px] animate-pulse"
              ></div>
            ))}
      </div>
    </div>
  );
}

export default IncomeList;

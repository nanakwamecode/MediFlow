import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

let dbInstance: any;

if (process.env.DATABASE_URL) {
  const sql = neon(process.env.DATABASE_URL);
  dbInstance = drizzle(sql, { schema });
} else {
  console.warn("⚠️ DATABASE_URL is not set. Running in mock database mode.");

  class MockDrizzle {
    private usersList: any[] = [
      {
        id: "demo-user-id",
        username: "doctor",
        displayName: "Dr. Kwabena Asante",
        // Bcrypt hash for "password"
        passwordHash: "$2a$10$tMhIspk2gD3t5/kC/g.e4.8i5yE588eGvW0BwB23.7.tJmR0s8y9y",
      },
    ];
    private otpsList: any[] = [];

    select(fields?: any) {
      const self = this;
      return {
        from(table: any) {
          const isUsers = table?.tableName === "users" || table === schema.users;
          const list = isUsers ? self.usersList : self.otpsList;

          return {
            where(condition: any) {
              const testSingle = (cond: any, item: any): boolean => {
                if (!cond) return true;
                if (cond.conditions && Array.isArray(cond.conditions)) {
                  return cond.conditions.every((c: any) => testSingle(c, item));
                }
                const colName = cond.left?.name || cond.left?.columnName;
                if (!colName) return true;

                let targetVal = cond.right;
                if (targetVal && typeof targetVal === "object" && "value" in targetVal) {
                  targetVal = targetVal.value;
                }

                if (targetVal !== undefined) {
                  return String(item[colName]) === String(targetVal);
                }
                return true;
              };

              const filteredList = list.filter((item) => testSingle(condition, item));

              const chain = {
                orderBy() {
                  return this;
                },
                limit(n: number) {
                  const result = filteredList.slice(0, n);
                  return Object.assign(Promise.resolve(result), {
                    then: (onfulfilled: any) => Promise.resolve(result).then(onfulfilled),
                  });
                },
                then(onfulfilled: any) {
                  return Promise.resolve(filteredList).then(onfulfilled);
                },
              };
              return chain;
            },
            then(onfulfilled: any) {
              return Promise.resolve(list).then(onfulfilled);
            },
          };
        },
      };
    }

    insert(table: any) {
      const self = this;
      const isUsers = table?.tableName === "users" || table === schema.users;
      const list = isUsers ? self.usersList : self.otpsList;

      return {
        values(data: any) {
          const newItem = {
            id: data.id || (isUsers ? `user-${Date.now()}` : Date.now()),
            createdAt: new Date(),
            used: 0,
            ...data,
          };
          list.push(newItem);

          return {
            returning(fields?: any) {
              const result = [newItem];
              return Object.assign(Promise.resolve(result), {
                then: (onfulfilled: any) => Promise.resolve(result).then(onfulfilled),
              });
            },
            then(onfulfilled: any) {
              return Promise.resolve([newItem]).then(onfulfilled);
            },
          };
        },
      };
    }

    update(table: any) {
      const self = this;
      const isUsers = table?.tableName === "users" || table === schema.users;
      const list = isUsers ? self.usersList : self.otpsList;

      return {
        set(updates: any) {
          return {
            where(condition: any) {
              const testSingle = (cond: any, item: any): boolean => {
                if (!cond) return true;
                if (cond.conditions && Array.isArray(cond.conditions)) {
                  return cond.conditions.every((c: any) => testSingle(c, item));
                }
                const colName = cond.left?.name || cond.left?.columnName;
                if (!colName) return true;

                let targetVal = cond.right;
                if (targetVal && typeof targetVal === "object" && "value" in targetVal) {
                  targetVal = targetVal.value;
                }

                if (targetVal !== undefined) {
                  return String(item[colName]) === String(targetVal);
                }
                return true;
              };

              const updatedRows: any[] = [];
              list.forEach((item) => {
                if (testSingle(condition, item)) {
                  Object.assign(item, updates);
                  updatedRows.push(item);
                }
              });

              return {
                returning(fields?: any) {
                  return Object.assign(Promise.resolve(updatedRows), {
                    then: (onfulfilled: any) => Promise.resolve(updatedRows).then(onfulfilled),
                  });
                },
                then(onfulfilled: any) {
                  return Promise.resolve(updatedRows).then(onfulfilled);
                },
              };
            },
          };
        },
      };
    }

    execute(sqlChunk: any) {
      const result = {
        rows: [
          {
            current_time: new Date().toISOString(),
          },
        ],
      };
      return Object.assign(Promise.resolve(result), {
        then: (onfulfilled: any) => Promise.resolve(result).then(onfulfilled),
      });
    }
  }

  dbInstance = new MockDrizzle();
}

export const db = dbInstance;

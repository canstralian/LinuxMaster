import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const modules = pgTable("modules", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // 'system', 'security', 'network'
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  script: text("script").notNull(),
  enabled: boolean("enabled").default(true),
});

export const executions = pgTable("executions", {
  id: serial("id").primaryKey(),
  moduleId: integer("module_id").references(() => modules.id),
  status: text("status").notNull(), // 'running', 'success', 'error'
  output: text("output").default(""),
  startTime: timestamp("start_time").defaultNow(),
  endTime: timestamp("end_time"),
  duration: integer("duration"), // in milliseconds
});

export const systemMetrics = pgTable("system_metrics", {
  id: serial("id").primaryKey(),
  timestamp: timestamp("timestamp").defaultNow(),
  cpuUsage: integer("cpu_usage").notNull(),
  memoryUsage: integer("memory_usage").notNull(),
  storageUsage: integer("storage_usage").notNull(),
  temperature: integer("temperature").notNull(),
  additionalData: json("additional_data"),
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // 'success', 'warning', 'info', 'error'
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertModuleSchema = createInsertSchema(modules).omit({ id: true });
export const insertExecutionSchema = createInsertSchema(executions).omit({ id: true });
export const insertSystemMetricsSchema = createInsertSchema(systemMetrics).omit({ id: true });
export const insertActivitySchema = createInsertSchema(activities).omit({ id: true });

export type Module = typeof modules.$inferSelect;
export type InsertModule = z.infer<typeof insertModuleSchema>;
export type Execution = typeof executions.$inferSelect;
export type InsertExecution = z.infer<typeof insertExecutionSchema>;
export type SystemMetrics = typeof systemMetrics.$inferSelect;
export type InsertSystemMetrics = z.infer<typeof insertSystemMetricsSchema>;
export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;

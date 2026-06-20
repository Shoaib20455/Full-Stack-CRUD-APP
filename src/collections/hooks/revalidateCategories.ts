import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
} from "payload";
import { revalidateCategories } from "@/app/(app)/actions";

export const revalidateCategoriesAfterChangeHook: CollectionAfterChangeHook =
  async () => {
    await revalidateCategories();
  };

export const revalidateCategoriesAfterDeleteHook: CollectionAfterDeleteHook =
  async () => {
    await revalidateCategories();
  };

import { randomUUID } from 'expo-crypto';

export type UniqueItem = {
  uuid: string;
};

const uniqueItemBuilder = (): UniqueItem => ({
  uuid: randomUUID(),
});

/**
 * Custom hook that provides functionality to generate arrays of unique items.
 * The single items have `uuid` property created with `randomUUID` from `expo-crypto`.
 *
 * Mostly used for generating skeleton items for flat lists.
 * The `uuid` property is used to identify the item in the flat list that are skeletons.
 *
 * The `getUniqueItems` function is exported because the number of skeletons required in
 * a page or component may vary.
 *
 * @returns An object containing the getUniqueItems function
 */
export const useUniqueItems = () => {
  const getUniqueItems = (numberOfItems: number) => {
    return Array.from({ length: numberOfItems }, uniqueItemBuilder);
  };

  return { getUniqueItems };
};

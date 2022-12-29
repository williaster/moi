/* eslint-disable no-nested-ternary */
import { HierarchyNode, pack } from 'd3-hierarchy';

interface IngredientHierarchy {
  type: string;
  name: string;
  value: number;
}

export default function getIngredientPack(
  hierarchy: HierarchyNode<IngredientHierarchy>,
  size: number,
) {
  const copy = hierarchy.copy();
  return pack<IngredientHierarchy>()
    .size([size, size])
    .padding(d => (d.height === 1 ? 1 : d.height === 2 ? 5 : d.height === 3 ? 5 : 0))(copy);
}

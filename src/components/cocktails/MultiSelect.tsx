import React, { useCallback, useRef } from 'react';
import Downshift, { DownshiftProps } from 'downshift';

export interface MultiSelectProps<Item extends object> {
  selectedItems: Item[];
  onChange: (items: Item[], downshift?: any) => void;
}

export default function MultiSelect<Item extends object>({
  selectedItems,
  onSelect,
  onChange,
  children,
  ...downshiftProps
}: Omit<DownshiftProps<Item>, keyof MultiSelectProps<Item>> & MultiSelectProps<Item>) {
  const selectedItemsRef = useRef(selectedItems);
  selectedItemsRef.current = selectedItems;
  const removeItem = useCallback(itemToRemove => {
    const nextSelectedItems = selectedItemsRef.current.filter(
      item => item.value !== itemToRemove.value,
    );
    console.log('Removing item', itemToRemove);
    console.log('Next items', nextSelectedItems);

    onChange(nextSelectedItems);
  }, []);

  const handleSelection = useCallback(
    (selectedItem: Item, downshift?: any) => {
      const isSelected = selectedItems.includes(selectedItem);

      const nextSelectedItems = isSelected
        ? selectedItems.filter(item => item !== selectedItem)
        : [...selectedItems, selectedItem];

      onChange(nextSelectedItems, downshift);
    },
    [selectedItems],
  );

  const getRemoveButtonProps = useCallback(
    ({ onClick, item, ...props } = {}) => ({
      onClick: e => {
        if (onClick) onClick(e);
        e.stopPropagation();
        removeItem(item);
      },
      ...props,
    }),
    [],
  );

  const stateReducer = useCallback(
    (state, changes) => {
      switch (changes.type) {
        case Downshift.stateChangeTypes.keyDownEnter:
        case Downshift.stateChangeTypes.clickItem:
          return {
            ...changes,
            highlightedIndex: state.highlightedIndex,
            isOpen: true,
            inputValue: '',
          };
        default:
          return changes;
      }
    },
    [selectedItems],
  );

  return (
    <Downshift
      {...downshiftProps}
      stateReducer={stateReducer}
      onChange={handleSelection}
      selectedItem={null}
    >
      {downshift =>
        children({
          getRemoveButtonProps,
          removeItem,
          selectedItems,
          ...downshift,
        })
      }
    </Downshift>
  );
}

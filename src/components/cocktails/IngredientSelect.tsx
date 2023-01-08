/* eslint-disable no-undef */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useCallback, useMemo, useRef } from 'react';
import Downshift, { DownshiftProps } from 'downshift';
import useStore from './appStore';
import { categoryColorScale } from './colors';
import getCocktailPack from './parsers/getCocktailPack';
import getCocktailLookup from './parsers/getCocktailLookup';
import getIngredients from './parsers/getIngredients';
import MultiSelect from './MultiSelect';

interface IngredientSelectProps {
  pack: ReturnType<typeof getCocktailPack>;
  lookup: ReturnType<typeof getCocktailLookup>;
}

interface BaseItem {
  id: string;
  value: string;
  label: string;
}

interface SimpleIngredientItem extends BaseItem {
  type: 'ingredient';
  fraction_of_cocktails?: number;
  cocktail_count: number;
  category: string;
}

interface VerboseIngredientItem extends BaseItem {
  type: 'verbose_ingredient';
  simple_ingredient: string;
  fraction_of_cocktails?: number;
  cocktail_count: number;
  category: string;
}
type IngredientItem = SimpleIngredientItem | VerboseIngredientItem;
interface CocktailItem extends BaseItem {
  type: 'cocktail';
}

type Item = IngredientItem | CocktailItem;

const ITEM_TYPE_LABELS = {
  ingredient: 'Ingredient',
  verbose_ingredient: 'Ingredient',
  cocktail: 'Cocktail',
};

export default function IngredientSelect({ pack, lookup }: IngredientSelectProps) {
  //   const items = useMemo(() => ingredients.map(i => ({ value: i, label: i })), [ingredients]);
  const { selectedIngredients, selectedCocktail, setSelectedIngredients } = useStore();

  const onChange = useCallback(
    items => {
      console.log('Next selected items', items);
      if (items) {
        const vals = items.map(i => i.value);
        setSelectedIngredients(vals);
      }
    },
    [setSelectedIngredients],
  );

  const inputRef = useRef<HTMLInputElement>();

  const allIngredients = useMemo(() => getIngredients(pack), [pack]);
  const allCocktails = useMemo(() => Object.keys(pack), [pack]);

  const getItems: (val: string) => Item[] = useCallback(
    value => {
      let items: Item[] = [];
      if (value) {
        const regex = new RegExp(value, 'gi');
        // @TODO add cocktails
        Object.values(allIngredients).forEach((ingredient, i) => {
          const simple = ingredient.simple_ingredient;
          let isSelected = selectedIngredients.includes(simple);
          // value matches simple ingredient name
          if (!isSelected && simple.match(regex)) {
            items.push({
              type: 'ingredient',
              id: `${simple}-${i}`,
              value: simple,
              label: simple,
              cocktail_count: ingredient.cocktail_count,
              fraction_of_cocktails: ingredient.fraction_cocktails,
              category: ingredient.category,
            });
          } else {
            // value matches verbose ingredient name
            let didMatch = false;

            Object.keys(ingredient.verbose_ingredients).forEach(verbose => {
              isSelected = selectedIngredients.includes(verbose);
              if (!didMatch && !isSelected && verbose.match(regex)) {
                const cocktail_count = ingredient.verbose_ingredients[verbose];
                items.push({
                  type: 'verbose_ingredient',
                  id: verbose,
                  value: verbose,
                  label: verbose,
                  simple_ingredient: simple,
                  cocktail_count,
                  fraction_of_cocktails: cocktail_count / allCocktails.length,
                  category: ingredient.category,
                });
              }
            });
          }
        });

        items.sort((a: IngredientItem, b: IngredientItem) => b.cocktail_count - a.cocktail_count);
      } else {
        items = Object.values(allIngredients)
          .sort((a, b) => b.cocktail_count - a.cocktail_count)
          .slice(0, 15)
          .map((ingredient, i) =>
            selectedIngredients &&
            (selectedIngredients.includes(ingredient.simple_ingredient) ||
              selectedIngredients.some(
                maybeVerbose => !!ingredient.verbose_ingredients[maybeVerbose],
              ))
              ? null
              : {
                  type: 'ingredient',
                  id: `${ingredient.simple_ingredient}-${i}`,
                  value: ingredient.simple_ingredient,
                  label: ingredient.simple_ingredient,
                  cocktail_count: ingredient.cocktail_count,
                  fraction_of_cocktails: ingredient.fraction_cocktails,
                  category: ingredient.category,
                },
          )
          .filter(i => !!i);
      }

      return items;
    },
    [allIngredients, allCocktails],
  );

  const selectedItems = (selectedIngredients || [])
    .map(name => {
      let ingredient = allIngredients[name];
      if (!ingredient) {
        ingredient = Object.values(allIngredients).find(i => !!i.verbose_ingredients[name]);
        if (!ingredient) {
          console.warn('Could not find selected ingredient', name);
          return null;
        }
      }
      const item: Item = {
        type: 'ingredient',
        id: ingredient.simple_ingredient,
        value: ingredient.simple_ingredient,
        label: name,
        cocktail_count: ingredient.cocktail_count,
        fraction_of_cocktails: ingredient.fraction_cocktails,
        category: ingredient.category,
      };
      return item;
    })
    .filter(i => !!i);

  const color = categoryColorScale('alcohol');

  return (
    <MultiSelect<Item>
      selectedItems={selectedItems}
      itemToString={item => item?.id}
      onChange={onChange}
    >
      {({
        getInputProps,
        // getToggleButtonProps,
        getMenuProps,
        getRemoveButtonProps,
        removeItem,
        isOpen,
        inputValue,
        getItemProps,
        highlightedIndex,
        toggleMenu,
      }) => (
        <div style={{ minWidth: 200, width: '20vw', margin: 'auto', position: 'relative' }}>
          <div
            style={{
              cursor: 'pointer',
              position: 'relative',
              borderRadius: '4px',
              borderBottomRightRadius: isOpen ? 0 : 6,
              borderBottomLeftRadius: isOpen ? 0 : 6,
              padding: '4px 8px',
              boxShadow: '0 2px 3px 0 rgba(34,36,38,.15)',
              borderColor: color,
              borderWidth: 1,
              borderStyle: 'solid',
            }}
            onClick={() => {
              toggleMenu({ inputValue: inputRef?.current?.value ?? '' });
              if (!isOpen && inputRef.current) inputRef.current.focus();
            }}
          >
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                columnGap: 4,
                rowGap: 8,
                lineHeight: '1em',
              }}
            >
              <input
                ref={inputRef}
                placeholder="Search ingredients & cocktails"
                {...getInputProps({
                  ref: inputRef,
                  onKeyDown: event => {
                    if (event.key === 'Backspace' && !inputValue) {
                      onChange(selectedItems.slice(-1));
                      removeItem(selectedItems[selectedItems.length - 1]);
                    }
                  },
                  style: {
                    border: 'none',
                    flex: 1,
                    fontSize: 14,
                    minHeight: 27,
                    color: '#222',
                    outline: 'none',
                    background: 'rgba(0,0,0,0)',
                    minWidth: '100%',
                  },
                })}
              />
              {selectedItems.length > 0
                ? selectedItems.map(item => (
                    <div
                      key={item.id}
                      style={{
                        fontSize: 12,
                        padding: '4px 8px',
                        backgroundColor:
                          item.type === 'cocktail' ? color : categoryColorScale(item.category),
                        color: '#222',
                        borderRadius: 4,
                        lineHeight: '1em',
                        marginBottom: 8,
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'nowrap',
                          columnGap: 4,
                          alignItems: 'center',
                          lineHeight: 'inherit',
                        }}
                      >
                        <div>{item.label}</div>
                        <button
                          {...getRemoveButtonProps({ item })}
                          style={{
                            cursor: 'pointer',
                            border: 'none',
                            backgroundColor: 'transparent',
                            padding: '0 4px',
                            fontSize: '1.2em',
                            lineHeight: 'inherit',
                          }}
                        >
                          𝘅
                        </button>
                      </div>
                    </div>
                  ))
                : null}
            </div>
          </div>
          <ul
            {...getMenuProps({
              style: {
                padding: 0,
                marginTop: 0,
                position: 'absolute',
                backgroundColor: 'rgba(255,255,255,0.8)',
                width: '100%',
                maxHeight: '20rem',
                overflowY: 'auto',
                overflowX: 'hidden',
                outline: '0',
                transition: 'opacity .1s ease',
                borderRadius: '0 0 .28rem .28rem',
                boxShadow: '0 2px 3px 0 rgba(34,36,38,.15)',
                borderColor: '#96c8da',
                borderTopWidth: '0',
                borderRightWidth: 1,
                borderBottomWidth: 1,
                borderLeftWidth: 1,
                borderStyle: 'solid',
                border: isOpen ? null : 'none',
              },
            })}
          >
            {isOpen
              ? getItems(inputValue).map((item, index) => (
                  <RenderItem
                    key={item.id}
                    item={item}
                    highlight={highlightedIndex === index}
                    {...getItemProps({
                      item,
                      index,
                    })}
                    style={{
                      position: 'relative',
                      cursor: 'pointer',
                      display: 'block',
                      border: 'none',
                      height: 'auto',
                      textAlign: 'left',
                      borderTop: 'none',
                      lineHeight: '0.5em',
                      color: 'rgba(0,0,0,.87)',
                      fontSize: '0.5em',
                      textTransform: 'none',
                      fontWeight: '400',
                      boxShadow: 'none',
                      padding: '.8em 0.8em',
                      whiteSpace: 'nowrap',
                    }}
                  />
                ))
              : null}
          </ul>
        </div>
      )}
    </MultiSelect>
  );
}

function RenderItem({
  item,
  highlight,
  ...props
}: { item: Item; highlight: boolean } & React.HTMLProps<HTMLLIElement>) {
  return (
    <li
      {...props}
      style={{
        ...props.style,
        ...(highlight && { color: 'rgba(0,0,0,.95)', background: 'rgba(0,0,0,.03)' }),
        display: 'flex',
        flexWrap: 'nowrap',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'nowrap',
          alignItems: 'center',
          columnGap: 4,
        }}
      >
        {item.type === 'cocktail' && (
          <div style={{ borderRadius: 2, background: '#ddd', padding: '4px 4px' }}>Cocktail</div>
        )}
        {(item.type === 'ingredient' || item.type === 'verbose_ingredient') && (
          <div
            style={{
              borderRadius: 2,
              background: `${categoryColorScale(item.category)}aa`, // assumes hex
              padding: '4px 4px',
            }}
          >
            {item.category}
          </div>
        )}
        <div>{item.label}</div>
      </div>
      <div>
        {item.type === 'ingredient' || item.type === 'verbose_ingredient'
          ? `n=${item.cocktail_count}${
              item.fraction_of_cocktails == null
                ? ''
                : ` (${(item.fraction_of_cocktails * 100).toFixed(0)}%)`
            }`
          : ''}
      </div>
    </li>
  );
}

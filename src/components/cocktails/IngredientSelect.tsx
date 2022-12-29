/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useCallback, useMemo, useRef } from 'react';
import Downshift from 'downshift';
import useStore from './appStore';
import { blue } from './colors';

interface IngredientSelectProps {
  ingredients: string[];
}

export default function IngredientSelect({ ingredients }: IngredientSelectProps) {
  //   const items = useMemo(() => ingredients.map(i => ({ value: i, label: i })), [ingredients]);
  const { setSelectedIngredients } = useStore();
  const onChange = useCallback(
    items => {
      console.log(items);
      if (items) {
        const vals = items.map(i => i.id);
        setSelectedIngredients(vals);
      }
    },
    [setSelectedIngredients],
  );
  const inputRef = useRef<HTMLInputElement>();
  const getItems = useCallback(
    value => ingredients.filter(i => i.match(value)).map(i => ({ id: i, value: i, name: i })),
    [ingredients],
  );

  return (
    <MultiDownshift itemToString={item => item?.id} onChange={onChange}>
      {({
        getInputProps,
        getToggleButtonProps,
        getMenuProps,
        // note that the getRemoveButtonProps prop getter and the removeItem
        // action are coming from MultiDownshift composibility for the win!
        getRemoveButtonProps,
        removeItem,

        isOpen,
        inputValue,
        selectedItems,
        getItemProps,
        highlightedIndex,
        toggleMenu,
      }) => (
        <div style={{ width: 500, margin: 'auto', position: 'relative' }}>
          <div
            style={{
              cursor: 'pointer',
              position: 'relative',
              borderRadius: '6px',
              borderBottomRightRadius: isOpen ? 0 : 6,
              borderBottomLeftRadius: isOpen ? 0 : 6,
              padding: 10,
              paddingRight: 50,
              boxShadow: '0 2px 3px 0 rgba(34,36,38,.15)',
              borderColor: '#96c8da',
              borderTopWidth: '1',
              borderRightWidth: 1,
              borderBottomWidth: 1,
              borderLeftWidth: 1,
              borderStyle: 'solid',
            }}
            onClick={() => {
              toggleMenu();
              if (!isOpen && inputRef.current) inputRef.current.focus();
            }}
          >
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
              }}
            >
              {selectedItems.length > 0
                ? selectedItems.map(item => (
                    <div
                      key={item.id}
                      style={{
                        fontSize: 12,
                        margin: '4px 2px',
                        paddingTop: 2,
                        paddingBottom: 2,
                        paddingLeft: 8,
                        paddingRight: 8,
                        display: 'block',
                        wordWrap: 'normal',
                        backgroundColor: blue,
                        borderRadius: 4,
                      }}
                    >
                      <div
                        style={{
                          display: 'grid',
                          gridGap: 6,
                          gridAutoFlow: 'column',
                          alignItems: 'center',
                        }}
                      >
                        <span>{item.name}</span>
                        <button
                          {...getRemoveButtonProps({ item })}
                          style={{
                            cursor: 'pointer',
                            lineHeight: 0.8,
                            border: 'none',
                            backgroundColor: 'transparent',
                            padding: '0 4px',
                            fontSize: '16px',
                          }}
                        >
                          𝘅
                        </button>
                      </div>
                    </div>
                  ))
                : null}

              <input
                ref={inputRef}
                placeholder="Filter by ingredient"
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
                    marginLeft: 6,
                    flex: 1,
                    fontSize: 14,
                    minHeight: 27,
                    background: 'rgba(255,255,255,0.2)',
                    outline: 'none',
                    color: 'white',
                  },
                })}
              />
            </div>
          </div>
          <ul
            {...getMenuProps({
              isOpen,
              style: {
                padding: 0,
                marginTop: 0,
                position: 'absolute',
                backgroundColor: 'rgba(255,255,255,0.6)',
                color: 'white',
                width: '100%',
                maxHeight: '20rem',
                overflowY: 'auto',
                overflowX: 'hidden',
                outline: '0',
                transition: 'opacity .1s ease',
                borderRadius: '0 0 .28571429rem .28571429rem',
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
                  <li
                    key={item.id}
                    {...getItemProps({
                      item,
                      index,
                      isActive: highlightedIndex === index,
                      isSelected: selectedItems.includes(item),
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
                      padding: '.8rem 1.1rem',
                      whiteSpace: 'normal',
                      wordWrap: 'normal',

                      ...(highlightedIndex === index
                        ? {
                            color: 'rgba(0,0,0,.95)',
                            background: 'rgba(0,0,0,.03)',
                          }
                        : {}),
                      ...(selectedItems.includes(item) === index
                        ? {
                            color: 'rgba(0,0,0,.95)',
                            fontWeight: '700',
                          }
                        : {}),
                    }}
                  >
                    {item.name}
                  </li>
                ))
              : null}
          </ul>
        </div>
      )}
    </MultiDownshift>
  );
}

interface MultiDownshiftProps {
  onSelect: () => void;
  onChange: () => void;
}

class MultiDownshift extends React.Component<MultiDownshiftProps> {
  state = { selectedItems: [] };

  stateReducer = (state, changes) => {
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
  };

  handleSelection = (selectedItem, downshift) => {
    const callOnChange = () => {
      const { onSelect, onChange } = this.props;
      const { selectedItems } = this.state;
      if (onSelect) {
        onSelect(selectedItems, this.getStateAndHelpers(downshift));
      }
      if (onChange) {
        onChange(selectedItems, this.getStateAndHelpers(downshift));
      }
    };
    if (this.state.selectedItems.includes(selectedItem)) {
      this.removeItem(selectedItem, callOnChange);
    } else {
      this.addSelectedItem(selectedItem, callOnChange);
    }
  };

  removeItem = (item, cb) => {
    this.setState(({ selectedItems }) => {
      return {
        selectedItems: selectedItems.filter(i => i !== item),
      };
    }, cb);
  };

  addSelectedItem(item, cb) {
    this.setState(
      ({ selectedItems }) => ({
        selectedItems: [...selectedItems, item],
      }),
      cb,
    );
  }

  getRemoveButtonProps = ({ onClick, item, ...props } = {}) => {
    return {
      onClick: e => {
        // TODO: use something like downshift's composeEventHandlers utility instead
        if (onClick) onClick(e);
        e.stopPropagation();
        this.handleSelection(item);
      },
      ...props,
    };
  };

  getStateAndHelpers(downshift) {
    const { selectedItems } = this.state;
    const { getRemoveButtonProps, removeItem } = this;
    return {
      getRemoveButtonProps,
      removeItem,
      selectedItems,
      ...downshift,
    };
  }
  render() {
    const { children, ...props } = this.props;

    return (
      <Downshift
        {...props}
        stateReducer={this.stateReducer}
        onChange={this.handleSelection}
        selectedItem={null}
      >
        {downshift => children(this.getStateAndHelpers(downshift))}
      </Downshift>
    );
  }
}
